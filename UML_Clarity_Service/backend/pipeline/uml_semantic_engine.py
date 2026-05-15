import os
import json
import logging
from typing import Dict, Any, List
from openai import OpenAI
from pydantic import BaseModel, Field

from pipeline.utils import setup_logger

logger = setup_logger("uml_semantic_engine")

class UMLRelationship(BaseModel):
    source: str = Field(description="The ID of the source Use Case")
    target: str = Field(description="The ID of the target Use Case")
    type: str = Field(description="Must be exactly 'include' or 'extend'")

class UMLUseCase(BaseModel):
    id: str = Field(description="A unique identifier, e.g., UC1, UC2")
    label: str = Field(description="High-level, semantic user goal (e.g., 'Manage Employees', 'Apply Leave')")
    actor: str = Field(description="The human actor who initiates this use case")
    full_description: str = Field(description="Brief description of what this use case encompasses")

class UMLModel(BaseModel):
    actors: List[str] = Field(description="List of standardized actors (e.g., 'Admin', 'Employee', 'HR Manager')")
    use_cases: List[UMLUseCase]
    relationships: List[UMLRelationship]

def generate_semantic_uml(raw_requirements: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Transforms raw functional requirements into a Semantic UML Use Case diagram structure
    using a 3-Phase abstraction approach (Classification, Goal Abstraction, Relationship Generation).
    """
    api_key = os.environ.get("NVIDIA_API_KEY")
    if not api_key:
        logger.error("NVIDIA_API_KEY not found in environment.")
        return {"actors": [], "use_cases": [], "relationships": []}

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key
    )

    # Format the raw requirements for the prompt
    req_texts = []
    for req in raw_requirements:
        goal = req.get("goal", "").strip()
        role = req.get("role", "Unknown")
        req_type = req.get("type", "unknown")
        # only include actual requirements or context to save tokens
        if goal and req_type != "metadata":
            req_texts.append(f"[{req_type}] {goal}")

    prompt_content = "\n".join(req_texts)

    system_prompt = """
You are an expert Requirements Engineer and UML Architect.
Your task is to transform raw functional requirements into a highly abstract, semantic UML Use Case Diagram model.

Phase 1 (Classification): Filter out NFRs, internal system behaviors, UI mechanics, and security constraints.
Phase 2 (Goal Abstraction): Abstract raw CRUD sentences into high-level user goals (e.g., "Manage Employees"). DO NOT just copy requirement text. The label must be a Verb-Noun goal. Identify correct human actors (e.g., "HR Manager", "Admin"). Never use "System" as an actor.
Phase 3 (Relationship Generation): Identify mandatory shared behaviors as `include` relationships (e.g., "Apply Leave" includes "Authenticate User") and optional behaviors as `extend` relationships.

You MUST output strictly in the following JSON format. Do not deviate from these keys:
{
  "actors": ["Admin", "HR Manager", "Employee", "System Admin"],
  "use_cases": [
    {
      "id": "UC1",
      "label": "Manage Employees",
      "actor": "Admin",
      "full_description": "Admins add, edit, and delete employee records."
    }
  ],
  "relationships": [
    {
      "source": "UC2",
      "target": "UC1",
      "type": "include"
    }
  ]
}
    """

    try:
        response = client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Extract the semantic UML use case model from these requirements:\n\n{prompt_content}"}
            ],
            temperature=0.2,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )

        result_json_str = response.choices[0].message.content
        logger.info("Successfully generated semantic UML from LLM.")
        
        # Parse and validate just in case
        result_data = json.loads(result_json_str)
        
        # In case the model wrapped it in a property
        if "use_cases" not in result_data and len(result_data.keys()) == 1:
            first_key = list(result_data.keys())[0]
            if isinstance(result_data[first_key], dict) and "use_cases" in result_data[first_key]:
                result_data = result_data[first_key]

        return result_data

    except Exception as e:
        logger.error(f"Failed to generate semantic UML: {e}")
        return {"actors": [], "use_cases": [], "relationships": []}
