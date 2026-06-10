export interface WalkthroughStep {
  target: string; // CSS selector
  title: string;
  body: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface PathTour {
  pattern: RegExp;
  steps: WalkthroughStep[];
}

export const walkthroughTours: PathTour[] = [
  {
    pattern: /^\/projects\/?$/,
    steps: [
      {
        target: '[data-tour="sidebar"]',
        title: 'Your Command Center',
        body: 'Welcome to ClarityStack! This sidebar is your trusty compass. Use it to quickly jump between the Diagram Builder, Document Analysis, and your Account Settings. Everything is just one click away!',
        placement: 'right'
      },
      {
        target: '[data-tour="new-project"]',
        title: 'Spark a New Idea',
        body: 'Ready to build something awesome? Click here to kick off a new project! You\'ll give it a name, define your big goals, and we\'ll set up a fresh workspace for your team instantly.',
        placement: 'top'
      },
      {
        target: '[data-tour="discover-projects"]',
        title: 'Discover & Collaborate',
        body: 'Need some inspiration? Use this search bar to dive into public projects made by other users. It\'s a great way to see how experts structure their work and borrow brilliant ideas.',
        placement: 'bottom'
      }
    ]
  },
  {
    pattern: /^\/projects\/[^/]+\/chats\/?$/,
    steps: [
      {
        target: '[data-tour="import-chats"], .py-16 button',
        title: 'Feed the Brain',
        body: 'This is where the magic starts! Upload your chaotic team chat histories here (like Discord, Slack, or Teams). Our AI will chew through the noise and pull out the actual decisions, so you never lose track of a bright idea.',
        placement: 'top'
      },
      {
        target: '[data-tour="satellite-tabs"]',
        title: 'Switch Your Perspective',
        body: 'Don\'t just read text—visualize it! Use these tabs to flip between a timeline of changes, a visual map of your project\'s brain, or even generate flashcards to quiz yourself on technical details.',
        placement: 'bottom'
      }
    ]
  },
  {
    pattern: /^\/projects\/[^/]+\/chats\/[^/]+\/?$/,
    steps: [
      {
        target: '[data-tour="prompt-input"]',
        title: 'Ask the Oracle',
        body: 'Got a burning question about your project? Just ask! Type things like "What did we decide about the payment gateway?" and the AI will instantly fetch the exact answer from your chats.',
        placement: 'top'
      },
      {
        target: '[data-tour="model-selector"]',
        title: 'Pick Your AI Flavor',
        body: 'You\'re not stuck with just one brain! Click here to swap between top-tier AI models. Need pure logic? Pick one. Need creative problem solving? Pick another. You have full control.',
        placement: 'bottom'
      },
      {
        target: '[data-tour="signal-level"]',
        title: 'Cut the Noise',
        body: 'Tired of scrolling through casual chatter? Use this slider to filter out the fluff and only show high-signal messages that contain actual project decisions or architecture discussions.',
        placement: 'bottom'
      },
      {
        target: '[data-tour="synthesis-pane"]',
        title: 'The Synthesis Panel',
        body: 'Watch this space! As you chat, this panel automatically updates with a live summary of your project. It tracks roadblocks, highlights brilliant ideas, and keeps your entire team on the same page.',
        placement: 'left'
      }
    ]
  },
  {
    pattern: /^\/projects\/[^/]+\/kg\/?$/,
    steps: [
      {
        target: '[data-tour="graph-controls"]',
        title: 'Control the Chaos',
        body: 'Sometimes the AI sees connections everywhere. Use this slider to calm things down! Slide it up to only see the connections the AI is 100% confident about, or down to explore the wild, hidden links.',
        placement: 'left'
      },
      {
        target: '[data-tour="kg-canvas"]',
        title: 'Explore the Web',
        body: 'This is your project\'s neural network! Every bubble is a concept, feature, or database. Drag them around, zoom in, and see exactly how your entire system is wired together.',
        placement: 'center'
      }
    ]
  },
  {
    pattern: /^\/srs\/dashboard\/?$/,
    steps: [
      {
        target: '[data-tour="srs-uploader"]',
        title: 'Drop Your Docs Here',
        body: 'Got a massive requirements document? Just drag and drop it here. Our AI will devour the PDF, understand your goals, and break it down into clean, manageable pieces automatically.',
        placement: 'bottom'
      },
      {
        target: '[data-tour="srs-doc-list"]',
        title: 'Document Health Check',
        body: 'Are your requirements actually good? The AI gives each document a "Health Score." If it spots vague sentences or missing logic, it will flag them here so you can fix them before writing a single line of code.',
        placement: 'top'
      }
    ]
  },
  {
    pattern: /^\/srs\/issues\/?$/,
    steps: [
      {
        target: '[data-tour="srs-split-pane"]',
        title: 'The Fixer-Upper',
        body: 'Time to polish! On the left, the AI points out exactly which sentences are confusing. On the right, you can edit your original document instantly to clear things up. It\'s like having a senior engineer review your work!',
        placement: 'center'
      },
      {
        target: '[data-tour="srs-actions"]',
        title: 'Ship It!',
        body: 'Looking pristine? Click here to export your perfectly polished document. Even better, you can send it straight into the Diagram Builder and watch the AI draw your system automatically!',
        placement: 'left'
      }
    ]
  },
  {
    pattern: /^\/uml\/dashboard\/?$/,
    steps: [
      {
        target: '[data-tour="uml-toolbox"]',
        title: 'Your Shape Arsenal',
        body: 'Instead of staring at a blank screen, drag and drop components directly from this Toolbox onto your canvas. Here\'s the breakdown:\n\n• USE CASE: Map out your users and what they can do.\n• ACTIVITY: Plan step-by-step logic and decision paths.\n• DFD: Track exactly how data flows through your system.\n• GENERAL: Grab basic rectangles and arrows to tie it all together.\n\nYou\'re the architect here—start dragging!',
        placement: 'right'
      },
      {
        target: '[data-tour="uml-toolbar"]',
        title: 'The Command Center',
        body: 'You\'ve got the power! This toolbar lets you control everything:\n\n• Oops? Use Undo/Redo.\n• Need a better look? Zoom in, fit to screen, or snap to 1:1.\n• Things getting messy? Click Auto-Align to instantly neaten up your diagram like magic!\n• Stuck? Check Insights for AI-powered architectural advice, or History to travel back in time.\n• Finally, export your masterpiece as a crisp PNG, SVG, or raw JSON!',
        placement: 'bottom'
      },
      {
        target: '[data-tour="uml-ai-prompt"]',
        title: 'IntelliSpec AI Builder',
        body: 'Don\'t feel like dragging shapes? Let the AI do the heavy lifting!\n\nSimply type what you want in this prompt bar (e.g., "Create a secure login flow"). Or, click "Upload SRS" to have the AI read your project documents and instantly generate the entire diagram for you!',
        placement: 'bottom'
      },
      {
        target: '[data-tour="uml-canvas"]',
        title: 'The Interactive Canvas',
        body: 'This is your playground. Once your shapes are dropped here, the fun begins.\n\nClick and drag to move things around, pull lines between nodes to connect them, and zoom in to inspect the fine details. Everything updates in real-time as you build your vision!',
        placement: 'left'
      }
    ]
  },
  {
    pattern: /^\/cards\/?$/,
    steps: [
      {
        target: '[data-tour="global-cards-grid"]',
        title: 'Choose Your Subject',
        body: 'Welcome to your master library! The AI has created flashcards for all your different projects. Click on any project here to start reviewing its specific terminology and decisions.',
        placement: 'top'
      },
      {
        target: 'body',
        title: 'Level Up Your Knowledge',
        body: 'Reviewing these cards a little bit every day tricks your brain into memorizing complex technical details without even trying. Get ready to impress your team!',
        placement: 'center'
      }
    ]
  }
];
