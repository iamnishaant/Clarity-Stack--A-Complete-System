const fs = require('fs');
let lines = fs.readFileSync('src/components/Dashboard.jsx', 'utf8').split('\n');

const replacement = [
    "                        {/* Properties Inspector sidebar \u2014 non-overlapping */}",
    "                        {selectedShape && (",
    "                            <div style={{ width: '280px', flexShrink: 0, background: T.surface, borderLeft: '1px solid ' + T.border, overflowY: 'auto', fontFamily: 'Inter, sans-serif' }}>",
    "                                <div style={{ padding: '16px' }}>",
    "                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>",
    "                                        <span style={{ fontWeight: '700', fontSize: '13px', color: T.accent, display: 'flex', alignItems: 'center', gap: '6px' }}><Edit3 size={14} /> Properties</span>",
    "                                        <button onClick={() => canvasRef.current?.deselectAll()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: '2px' }}><XCircle size={16} /></button>",
    "                                    </div>",
    "                                    <div style={{ fontSize: '11px', fontWeight: '600', color: T.badgeText, background: T.badgeBg, border: '1px solid ' + T.badgeBorder, padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px' }}>{selectedShape.type}</div>",
    "                                    <div style={{ marginBottom: '10px' }}>",
    "                                        <label style={{ fontSize: '11px', fontWeight: '600', color: T.textMuted, display: 'block', marginBottom: '4px' }}>Label</label>",
    "                                        <input type=\"text\" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} onBlur={() => canvasRef.current?.renameShape(selectedShape.id, editLabel)} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', borderRadius: '8px', border: '1.5px solid ' + T.border, background: T.inputBg, color: T.text, fontSize: '12px', outline: 'none' }} />",
    "                                    </div>",
    "                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>",
    "                                        <div style={{ flex: 1 }}><label style={{ fontSize: '10px', fontWeight: '600', color: T.textMuted, display: 'block', marginBottom: '3px' }}>X</label><input type=\"number\" value={Math.round(selectedShape.x)} onChange={(e) => { const v=parseInt(e.target.value,10); if(!isNaN(v)&&canvasRef.current){canvasRef.current.moveShape(selectedShape.id,v,selectedShape.y);setSelectedShape(p=>p?{...p,x:v}:null);}}} style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', borderRadius: '7px', border: '1px solid '+T.border, background: T.inputBg, color: T.text, fontSize: '12px', outline: 'none' }} /></div>",
    "                                        <div style={{ flex: 1 }}><label style={{ fontSize: '10px', fontWeight: '600', color: T.textMuted, display: 'block', marginBottom: '3px' }}>Y</label><input type=\"number\" value={Math.round(selectedShape.y)} onChange={(e) => { const v=parseInt(e.target.value,10); if(!isNaN(v)&&canvasRef.current){canvasRef.current.moveShape(selectedShape.id,selectedShape.x,v);setSelectedShape(p=>p?{...p,y:v}:null);}}} style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', borderRadius: '7px', border: '1px solid '+T.border, background: T.inputBg, color: T.text, fontSize: '12px', outline: 'none' }} /></div>",
    "                                    </div>",
    "                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>",
    "                                        <div style={{ flex: 1 }}><label style={{ fontSize: '10px', fontWeight: '600', color: T.textMuted, display: 'block', marginBottom: '3px' }}>Width</label><input type=\"number\" value={selectedShape.width} onChange={(e) => handleResizeProp('width', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', borderRadius: '7px', border: '1px solid '+T.border, background: T.inputBg, color: T.text, fontSize: '12px', outline: 'none' }} /></div>",
    "                                        <div style={{ flex: 1 }}><label style={{ fontSize: '10px', fontWeight: '600', color: T.textMuted, display: 'block', marginBottom: '3px' }}>Height</label><input type=\"number\" value={selectedShape.height} onChange={(e) => handleResizeProp('height', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', borderRadius: '7px', border: '1px solid '+T.border, background: T.inputBg, color: T.text, fontSize: '12px', outline: 'none' }} /></div>",
    "                                    </div>",
    "                                    <button onClick={() => { canvasRef.current?.deleteSelected(); setSelectedShape(null); }} style={{ width: '100%', padding: '8px', borderRadius: '8px', background: isDark?'#450a0a':'#fef2f2', border: '1px solid '+(isDark?'#991b1b':'#fecaca'), color: isDark?'#fca5a5':'#b91c1c', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={14} /> Delete Shape</button>",
    "                                </div>",
    "                            </div>",
    "                        )}",
    "                    </div>",
];

// Lines are 1-indexed; array is 0-indexed
// Replace lines 1628-1686 (indices 1627-1685 inclusive)
const before = lines.slice(0, 1627);
const after = lines.slice(1686);
const newLines = [...before, ...replacement, ...after];
fs.writeFileSync('src/components/Dashboard.jsx', newLines.join('\n'), 'utf8');
console.log('Fixed. New line count:', newLines.length);

// Verify with @babel/parser
try {
    const src = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');
    require('@babel/parser').parse(src, { sourceType: 'module', plugins: ['jsx'] });
    console.log('PARSE OK');
} catch(e) {
    console.log('PARSE ERROR at line ' + e.loc?.line + ': ' + e.message);
}
