
import { UserInput, GamePlan, ChatMessage, BlueprintSpec, NPC, GenMode, MarketAsset, UETemplate, LevelLayout, SavedProject } from "../../types";

const UE5_LOGIC_DESIGN_PATTERNS = `
UE5 PRODUCTION-GRADE LOGIC PATTERNS (MANDATORY TO IMPLEMENT):
1. STATE MANAGEMENT: Use Enums and Switch nodes to handle character states (Idle, Combat, Maneuver, Dead).
2. DECOUPLED COMMUNICATION: Use BPI_Interfaces for interaction and Event Dispatchers for signaling (e.g., OnHealthChanged).
3. COMPONENT-DRIVEN: Offload complex math to BPC_ActorComponents.
4. DEFENSIVE CODING: Always check 'Is Valid' before accessing references.
5. TIMER-BASED UPDATES: Use 'Set Timer by Event' instead of Tick for repeating logic (e.g., Health Regen).
6. DATA ASSETS: References to Data Tables or Data Assets for stat configuration.
`;

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

${UE5_LOGIC_DESIGN_PATTERNS}
`;

const PRODUCTION_STANDARD_RULES = `
UE5 PRODUCTION QUALITY RULES:
1. DEFENSIVE PROGRAMMING: Use 'Is Valid' checks before accessing any object reference.
2. ENUM DRIVEN: Use Enumerations for states (Idle, Combat, Dying) instead of multiple booleans.
3. CATEGORIZATION: Group variables and functions into logical categories (e.g., Stats, Inputs, Private).
4. TOOLTIPS: Provide clear tooltips for every variable.
5. NO TICK: Avoid Event Tick unless absolutely necessary for frame-dependent logic. Prefer Timers or Events.
6. COMPLEXITY REQUIREMENT: Every major system must have at least 6-10 interconnected nodes in the Event Graph showing full logic flow (e.g., Input -> Validation -> State Update -> FX -> Sound).
`;

export const buildPlanSystemInstruction = (input: UserInput): string => {
  const { level, ueVersion, assets, template } = input;
  
  return `You are a world-class Lead Technical Director at Epic Games. 
  Your task is to generate a professional, HIERARCHICAL development plan for UE ${ueVersion}.

  STRICT HIERARCHY PROTOCOL (MANDATORY):
  1. PHASE 1: ENVIRONMENT & PLUGINS. Migration (ALS/GASP/Lyra), Plugin activation, and Project Settings.
  2. PHASE 2: DATA STRUCTURES & INTERFACES. Define Enums, Structs, and BPI_Interfaces. This is the logic foundation.
  3. PHASE 3: CORE LOGIC COMPONENTS. Logic that lives in ActorComponents (BPC_) for modularity.
  4. PHASE 4: PLAYER & GAMEPLAY CLASSES. Integrating components into BP_Character, BP_GameMode, and BP_PlayerController.

  STRICT BLUEPRINT LOGIC CONTRACT:
  Every task creating an asset MUST include:
  - 'requiredFunctions': Explicit logic API (Inputs/Outputs). 
    * MANDATORY: The 'implementationTarget' field MUST match the assetName of the Blueprint being discussed.
    * Clearly state what this function accomplishes for the asset.
  - 'blueprintDetails': List variables (type/default) and components.
  - Label tasks that are 'Core Logic Architecture' vs 'Asset Creation'.

  ${UE5_EXHAUSTIVE_REFERENCE}
  ${PRODUCTION_STANDARD_RULES}

  Ensure Phase 1 covers the technical handshake between ${template} and ${assets.join('/')}.
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
    1. Define the technical hierarchy. Focus on DECOUPLED communication (Interfaces/Dispatchers).
    2. For the main gameplay systems, define the necessary internal function API, clearly mapping each function to its target Blueprint.
    3. Ensure a clear path from Data -> Components -> Pawn integration.
  `;
};

export const buildBlueprintSpecSystemInstruction = (mode: GenMode): string => {
  return `You are a Senior Unreal Technical Artist specializing in scalable logic systems. 
  
  HIERARCHICAL LOGIC RULES:
  1. Use internal FUNCTIONS for heavy calculations or reusable logic.
  2. Use MACROS for common flow patterns (e.g., "Check Validity and Branch").
  3. Use EVENT DISPATCHERS for notifying other actors without tight coupling.
  4. The Event Graph should only handle core hooks (BeginPlay, Tick, Input) that delegate to these functions.

  LOGIC DENSITY REQUIREMENT:
  - Do not provide empty nodes. 
  - The 'eventGraph' nodes must represent a REAL implementation. 
  - Connect events to variables, then to functions, then to output actions (FX, Animation, Sound).
  - Use Enums for state changes.

  ${UE5_EXHAUSTIVE_REFERENCE}
  ${PRODUCTION_STANDARD_RULES}
  
  TASK: Generate a professional, PRODUCTION-READY Blueprint logic specification.`;
};

export const buildBlueprintSpecPrompt = (assetName: string, description: string, context: string = ''): string => {
  return `Generate a HIGHLY LOGICAL specification for: ${assetName}.
  DESCRIPTION: ${description}
  ENGINE CONTEXT: ${context}
  
  MANDATORY:
  - 'logicPattern': Explain the architectural pattern chosen (e.g., Strategy, Observer, State Machine).
  - 'variables': All internal state trackers with categories and tooltips.
  - 'functions': Deep API definitions. Ensure implementationTarget is '${assetName}'.
  - 'eventGraph': Provide a comprehensive execution flow. 
    * Show how input or engine events trigger internal state changes.
    * Show calls to your defined functions.
    * Include 'Sequence' nodes to handle multiple logic branches from a single event.
    * Use 'Branch' nodes to validate conditions before action.`;
};

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
  return `Blueprint logic auditor. Detect execution errors. 
  If you see an empty or simple logic flow, reject it and demand deeper node complexity (at least 6 nodes per event).
  Ensure all variable types are standard UE5 types (Boolean, Float, Integer, Vector, Rotator, Actor, etc).`;
};
export const buildSearchAgentSystemInstruction = (): string => {
  return `Search specialist for UE5 docs and tutorials.`;
};
export const buildDesignReviewPrompt = (plan: GamePlan, input: UserInput): string => {
  return `Review project: ${plan.title}. Level: ${input.level}. Platform: ${input.platforms.join('/')}.`;
};

export const buildChatSystemInstruction = (): string => {
  return `You are the UE5 Senior Technical Architect Assistant. 
  Your role is to guide the user and REFINE the existing project roadmap.
  
  STRICT OPERATIONAL CONSTRAINTS:
  1. NO DELETION: You do not have the authority to delete, reset, or recreate the project or its roadmap.
  2. NO RECREATION: If a user asks to "start over" or "recreate", explain that you can only evolve the current design.
  3. TECHNICAL REFINEMENT: You ARE empowered to:
     - ADD NEW TASKS: If the user describes a new requirement, add appropriate tasks to existing phases or create a new phase.
     - UPDATE REQUIREMENTS: Update existing tasks by adding 'requiredFunctions', 'variables', or 'blueprintDetails' to satisfy new user constraints.
     - LOGIC LINKING: Ensure any new function has a clear 'implementationTarget' matching a Blueprint asset in the plan.
     - GUIDANCE: Provide step-by-step technical advice for Unreal Engine 5.
  
  When providing an 'updatedPlan', return the ENTIRE plan with your modifications integrated. Never return an empty or truncated phases list.`;
};

export const buildChatPrompt = (currentPlan: GamePlan, history: ChatMessage[], newMessage: string): string => {
  return `
    CURRENT ROADMAP: ${JSON.stringify(currentPlan)}
    USER CONVERSATION: ${JSON.stringify(history.slice(-5))}
    NEW MESSAGE: "${newMessage}"
    
    INSTRUCTION: 
    - Evaluate if the message requires a change to the technical roadmap (e.g., adding a feature, changing a mechanic).
    - If so, set 'hasPlanUpdates' to true and provide the fully modified 'updatedPlan'.
    - Specifically focus on adding 'requiredFunctions' and 'variables' to the relevant Blueprint tasks to satisfy the request.
    - Provide a helpful text 'response' explaining what was added or updated.
  `;
};

export const buildBlueprintVerificationPrompt = (draft: BlueprintSpec, description: string): string => {
  return `Verify draft: ${draft.assetName}. 
  Logic check: 
  - Does the Event Graph contain actual interconnected nodes?
  - Are functions being called?
  - Is the logic decoupled (using interfaces/dispatchers)?
  - Is there complexity (at least 6-8 nodes for primary gameplay loops)?
  - If the draft is weak, expand it significantly before returning.`;
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
  return `Level Designer and Technical Environment Artist. 
  
  CRITICAL VISUAL PROTOCOL:
  Your visuals MUST be generated as TOP-DOWN ARCHITECTURAL BLUEPRINTS or TACTICAL MAPS.
  - Perspective: Strictly Top-Down Orthographic.
  - Style: Blueprint (white lines on blue) or Technical Line Art (black lines on white/grid).
  - Purpose: Clear spatial planning for user placement of actors.
  - NO perspective concept art. NO cinematic renders.
  
  ENVIRONMENT RULE: 
  Every layout MUST include spatial volumes.
  - If enemies or AI are present: You MUST place a 'NavMeshBoundsVolume'.
  - Use 'Trigger Volume' for narrative events.
  - Use 'NavMesh' POI type specifically for AI navigation areas.`;
};
export const buildLevelLayoutPrompt = (plan: GamePlan, locationData?: string): string => {
  return `Level Design Planning for ${plan.title}. Context: ${locationData}. 
  
  MANDATORY VISUAL STYLE: 
  Generate a strictly TOP-DOWN BLUEPRINT FLOOR PLAN. 
  The visualPrompt should describe an orthographic architectural map with a technical grid background.
  
  MANDATORY VOLUME: 
  Place a Nav Mesh Bounds Volume covering the main playable area to enable AI navigation for any NPCs.`;
};
export const buildMapsSearchPrompt = (userInput: string): string => {
  return `Find location data for: ${userInput}`;
};
export const buildPythonScriptSystemInstruction = (): string => {
  return `Pipeline engineer. Project auto-scaffolding.`;
};
export const buildPythonScriptPrompt = (project: SavedProject): string => {
  return `
    UE5 PROJECT ARCHITECTURE:
    - TITLE: ${project.title}
    - SUMMARY: ${project.summary}
    
    INSTRUCTION: Generate a comprehensive Unreal Engine 5 Python script for asset scaffolding.
  `;
};
export const buildOverseerPrompt = (plan: GamePlan, assets: string[]): string => {
  return `Audit for missing logic links. Roadmap: ${JSON.stringify(plan)}. Assets: ${assets.join(',')}`;
};
