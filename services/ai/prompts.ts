
import { UserInput, GamePlan, ChatMessage, BlueprintSpec, NPC, GenMode, MarketAsset, UETemplate, LevelLayout, SavedProject } from "../../types";

const UE5_EXHAUSTIVE_REFERENCE = `
UNREAL ENGINE 5 TECHNICAL REFERENCE LIBRARY (USE EXACT NAMES):

1. CORE EVENTS:
- Actor Lifecycle: Event BeginPlay, Event EndPlay, Event Destroyed, Event Tick, Event OnActorSpawned, Event OnActorBeginOverlap, Event OnActorEndOverlap, Event OnActorHit, Event OnTakeAnyDamage.
- Component: OnComponentBeginOverlap, OnComponentEndOverlap, OnComponentHit, OnComponentActivated.
- Input: InputAction (Modern Enhanced Input), InputAxis (Legacy), InputKey.
- AI: OnPerceptionUpdated, Receive Execute AI, Receive Abort AI.

2. EXECUTION FLOW:
- Branch, Sequence, Do Once, FlipFlop, Gate, MultiGate, Delay, Retriggerable Delay, Set Timer by Event, Set Timer by Function Name, For Each Loop, While Loop.

3. TRANSFORM & ACTIONS:
- Actor: Spawn Actor from Class, Destroy Actor, Set Actor Location/Rotation/Transform, Add Actor World Offset, Attach Actor to Actor.
- Component: Add Component, Set Relative Location/Rotation, Set Visibility, Set Material, Create Dynamic Material Instance.
- Character: Add Movement Input, Jump, Stop Jumping, Launch Character, Crouch, Set Max Walk Speed, Set Movement Mode.
- Physics: Add Force, Add Impulse, Set Simulate Physics, Set Enable Gravity.
`;

export const buildPlanSystemInstruction = (input: UserInput): string => {
  const { level, ueVersion, assets, template } = input;
  
  return `You are a world-class Lead Technical Director at Epic Games. 
  Your task is to generate a professional, HIERARCHICAL development plan for UE ${ueVersion}.

  STRICT HIERARCHY PROTOCOL (MANDATORY):
  1. PHASE 1: ENVIRONMENT & PLUGINS. Migration (ALS/GASP/Lyra), Plugin activation, and Project Settings (Input Mapping, Collision Channels).
  2. PHASE 2: DATA STRUCTURES & INTERFACES. Create Enums, Structs, and BPI_Interfaces. This is the foundation.
  3. PHASE 3: CORE LOGIC COMPONENTS. Logic that lives in ActorComponents (BPC_) before the character.
  4. PHASE 4: PAWNS & CHARACTERS. Integrating the components and data into BP_Character.

  STRICT BLUEPRINT API REQUIREMENT:
  Every Blueprint task MUST include:
  - 'requiredFunctions': A list of functions to create. Include parameters (Inputs/Outputs) and logic purpose.
  - 'blueprintDetails': List all mandatory variables (name, type, default) and components.

  ${UE5_EXHAUSTIVE_REFERENCE}

  Ensure Phase 1 covers the technical handshake between ${template} and ${assets.join('/')}.
  If GASP/ALS is used, Phase 1 tasks MUST focus on re-parenting and retargeting.

  OUTPUT FORMAT: JSON ONLY. High density: 8+ Phases. 6-10 Tasks per phase.`;
};

export const buildPlanPrompt = (input: UserInput): string => {
  const { gameIdea, genres, assets, mechanics, level, platforms, template } = input;
  return `
    PROJECT SPECIFICATION:
    - CONCEPT: "${gameIdea}"
    - BASE TEMPLATE: ${template}
    - FRAMEWORKS: ${assets.join(', ')}
    
    INSTRUCTION: Architect the project.
    1. Define the technical hierarchy. Do not start with Character logic until Interfaces and Data structures are defined in Phase 2.
    2. For the main character, define its internal variables (e.g., Stamina, Health, IsMoving) and functions (e.g., CalculateMovementSpeed, HandleStaminaDrain).
    3. Include exact migration steps for ${assets.join('/')}.
  `;
};

export const buildBlueprintSpecSystemInstruction = (mode: GenMode): string => {
  return `You are a Senior Unreal Technical Artist. 
  
  HIERARCHICAL LOGIC RULE:
  Do not put all logic in the Event Graph. 
  1. Define internal FUNCTIONS for heavy logic.
  2. Use the Event Graph ONLY for Event Hooks (BeginPlay, InputActions, Overlaps) that call these functions.
  3. Clearly define VARIABLE requirements.

  ${UE5_EXHAUSTIVE_REFERENCE}
  
  TASK: Generate a logically sound, clean Blueprint specification.`;
};

export const buildBlueprintSpecPrompt = (assetName: string, description: string, context: string = ''): string => {
  return `Generate an AIRTIGHT logic specification for: ${assetName}.
  DESCRIPTION: ${description}
  
  MANDATORY:
  - List all internal Variables with types.
  - List all custom Functions with Inputs/Outputs.
  - In Event Graph, show how these functions are called hierarchically.`;
};

// Existing builder exports...
export const buildLayoutPerformancePrompt = (layout: LevelLayout, userInput: UserInput): string => {
  return `Performance analysis for level: ${layout.name}. User: ${userInput.level}. Platform: ${userInput.platforms.join('/')}.`;
};
export const buildProjectAnalysisSystemInstruction = (): string => {
  return `UE5 Architect. Analyze concept for technical plugins and architecture mapping.`;
};
export const buildProjectAnalysisPrompt = (concept: string, allowedLists: any): string => {
  return `Audit concept: "${concept}". Map to: ${JSON.stringify(allowedLists)}.`;
};
export const buildCompatibilityAuditPrompt = (assets: MarketAsset[], version: string, template: UETemplate): string => {
  return `Audit compatibility for: ${assets.join(', ')}. Version: ${version}. Template: ${template}.`;
};
export const buildBehaviorTreePrompt = (assetName: string, description: string): string => {
  return `Generate BT and Blackboard for ${assetName}: ${description}.`;
};
export const buildBehaviorTreeSystemInstruction = (mode: GenMode): string => {
  return `Senior AI Engineer. Behavior Trees Expert.`;
};
export const buildBlueprintDirectorSystemInstruction = (): string => {
  return `Blueprint logic auditor. Detect execution errors.`;
};
export const buildSearchAgentSystemInstruction = (): string => {
  return `Search specialist for UE5 docs and tutorials.`;
};
export const buildDesignReviewPrompt = (plan: GamePlan, input: UserInput): string => {
  return `Review project: ${plan.title}. Level: ${input.level}. Platform: ${input.platforms.join('/')}.`;
};
export const buildChatSystemInstruction = (): string => {
  return `UE5 PM. Append-only roadmap expansion.`;
};
export const buildChatPrompt = (currentPlan: GamePlan, history: ChatMessage[], newMessage: string): string => {
  return `Update plan based on: ${newMessage}. History length: ${history.length}.`;
};
export const buildBlueprintVerificationPrompt = (draft: BlueprintSpec, description: string): string => {
  return `Verify draft: ${draft.assetName}.`;
};
export const buildEnhanceConceptPrompt = (concept: string): string => {
  return `Refine concept: "${concept}".`;
};
export const buildMaterialSpecSystemInstruction = (): string => {
  return `Material Architect.`;
};
export const buildMaterialSpecPrompt = (assetName: string, description: string): string => {
  return `Generate Material for ${assetName}: ${description}`;
};
export const buildEnhancedInputSpecSystemInstruction = (): string => {
  return `Input Expert.`;
};
export const buildEnhancedInputPrompt = (assetName: string, description: string): string => {
  return `Define Input for ${assetName}: ${description}`;
};
export const buildCppGenSystemInstruction = (): string => {
  return `C++ Guru.`;
};
export const buildCppGenPrompt = (assetName: string, blueprintSpec: BlueprintSpec): string => {
  return `Code for ${assetName}. Parent: ${blueprintSpec.parentClass}`;
};
export const buildVisualPromptsSystemInstruction = (): string => {
  return `Art Director.`;
};
export const buildVisualPromptsPrompt = (plan: GamePlan): string => {
  return `Art prompts for ${plan.title}`;
};
export const buildT3dSystemInstruction = (): string => {
  return `T3D Export specialist.`;
};
export const buildT3dPrompt = (assetName: string, blueprintSpec: BlueprintSpec): string => {
  return `Export ${assetName} to T3D.`;
};
export const buildNarrativeSystemInstruction = (): string => {
  return `Narrative lead.`;
};
export const buildQuestPrompt = (plan: GamePlan): string => {
  return `Quests for ${plan.title}`;
};
export const buildNpcPrompt = (plan: GamePlan): string => {
  return `NPCs for ${plan.title}`;
};
export const buildDialoguePrompt = (npc: NPC): string => {
  return `Dialogue for ${npc.name}`;
};
export const buildLevelLayoutSystemInstruction = (): string => {
  return `Level Designer.`;
};
export const buildLevelLayoutPrompt = (plan: GamePlan, locationData?: string): string => {
  return `Level for ${plan.title}. Context: ${locationData}`;
};
export const buildMapsSearchPrompt = (userInput: string): string => {
  return `Find location data for: ${userInput}`;
};
export const buildPythonScriptSystemInstruction = (): string => {
  return `Pipeline engineer. Project auto-scaffolding.`;
};
// Fix: Added missing buildPythonScriptPrompt export to resolve the module error in client.ts
export const buildPythonScriptPrompt = (project: SavedProject): string => {
  return `
    UE5 PROJECT ARCHITECTURE:
    - TITLE: ${project.title}
    - SUMMARY: ${project.summary}
    - INPUT SPEC: ${JSON.stringify(project.input)}
    
    HIERARCHY TASKS:
    ${project.plan.phases.map(p => p.tasks.map(t => `- Create ${t.assetName} in ${t.folderPath}: ${t.description}`).join('\n')).join('\n')}
    
    INSTRUCTION: Generate a comprehensive Unreal Engine 5 Python automation script.
    - Use the 'unreal' library.
    - Implement a 'AssetBuilder' class.
    - Automate folder creation.
    - Instantiate 'Blueprint', 'Material', 'EnhancedInput' assets.
    - Set base classes (Actor, Character, etc.) correctly.
  `;
};
export const buildOverseerPrompt = (plan: GamePlan, assets: string[]): string => {
  return `Audit for missing logic links. Roadmap: ${JSON.stringify(plan)}. Assets: ${assets.join(',')}`;
};
