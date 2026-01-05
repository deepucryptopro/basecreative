export interface TemplateConfig {
    id: string;
    name: string;
    width: number;
    height: number;
}

export const TEMPLATES: TemplateConfig[] = [
    { id: '1', name: "Social Post", width: 1080, height: 1080 }, // Square
    { id: '2', name: "Story", width: 1080, height: 1920 },      // Tall
    { id: '3', name: "Banner", width: 1500, height: 500 },      // Wide
    { id: '4', name: "Meme", width: 800, height: 600 },         // Standard
];

export const getTemplateById = (id: string | null) => TEMPLATES.find(t => t.id === id);
