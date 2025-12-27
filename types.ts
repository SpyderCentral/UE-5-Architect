
export enum ExperienceLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
}

export type AppStep = 'landing' | 'input' | 'workspace' | 'library';

export type GenMode = 'Fast' | 'Default' | 'Large Context' | 'Heavy';

export type UETemplate = 'None' | 'Third Person' | 'First Person' | 'Top Down' | 'Vehicle' | 'Handheld AR' | 'Virtual Reality';
export type MarketAsset = 
  | 'ALS V4 (Advanced Locomotion)' 
  | 'Game Animation Sample (GASP)' 
  | 'Common UI Plugin' 
  | 'PCG Framework' 
  | 'Ultra Dynamic Sky' 
  | 'Electronic Nodes' 
  | 'FluidNinja'
  | 'Lyra Starter Game'
  | 'Gameplay Ability System (GAS)'
  | 'Motion Warping'
  | 'Control Rig'
  | 'Water System'
  | 'Landmass Plugin';

export enum BridgeStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Error = 'Error'
}

export enum DriveSyncStatus {
  Unlinked = 'Unlinked',
  Linked = 'Linked',
  Syncing = 'Syncing',
  Error = 'Error'
}

export interface CompatibilityWarning {
  asset: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  issue: string;
  fix: string;
}

export interface AssetCompatibilityReport {
  overallStatus: 'Compatible' | 'Warnings' | 'Critical Issues';
  warnings: CompatibilityWarning[];
  architecturalAdvice: string;
}

export interface SubsystemStatus {
  pillar: 'Logic' | 'Visuals' | 'AI' | 'Systems';
  score: number;
  status: 'Nominal' | 'Incomplete' | 'Critical Gap';
  details: string;
}

export interface OverseerReport {
  overallReadiness: number;
  summary: string;
  subsystems: SubsystemStatus[];
  missingCriticalAssets: { name: string; type: string; reason: string }[];
  technicalDebtAlerts: string[];
  suggestedNextAction: string;
}

export interface TutorialLink {
  uri: string;
  title: string;
  snippet?: string;
}

export interface MarketplaceSuggestion {
  name: string;
  uri: string;
  price: string;
  compatibility: string;
  description: string;
  category?: string;
  technicalOverlaps?: string[];
}

export interface BlackboardKey {
  name: string;
  type: 'Bool' | 'Float' | 'Int' | 'Vector' | 'Rotator' | 'String' | 'Object' | 'Class' | 'Enum' | 'Name';
  description: string;
}

export interface BehaviorTreeNode {
  id: string;
  name: string;
  type: 'Composite' | 'Task' | 'Decorator' | 'Service';
  subType?: 'Selector' | 'Sequence' | 'SimpleParallel';
  description: string;
  children?: string[]; // IDs of child nodes
  decorators?: { name: string, condition: string }[];
  services?: { name: string, logic: string }[];
}

export interface BehaviorTreeSpec {
  assetName: string;
  blackboardAsset: string;
  rootNode: string;
  nodes: Record<string, BehaviorTreeNode>;
  blackboardKeys: BlackboardKey[];
  logicSummary: string;
  validationReport?: BlueprintValidationReport;
}

export interface ConflictAnalysis {
  summary: string;
  conflicts: AssetConflict[];
  patchSteps: string[];
  recommendedPatchAsset: string;
}

export interface AssetConflict {
  affectedAssets: string[];
  conflictingClass: string;
  severity: 'Low' | 'Medium' | 'High';
  reason: string;
}

export interface PerformanceAnalysis {
  id: string;
  timestamp: number;
  image: string;
  summary: string;
  score: number;
  metrics: { label: string; value: string; status: 'Good' | 'Warning' | 'Critical' }[];
  bottlenecks: string[];
  recommendations: { title: string; description: string; complexity: 'Low' | 'Medium' | 'High' }[];
}

export interface MetaSoundSpec {
  assetName: string;
  description: string;
  nodes: any[];
  connections: any[];
  parameters: any[];
  dspLogic: string;
  tutorials?: TutorialLink[];
}

export interface PcgSpec {
  assetName: string;
  description: string;
  nodes: any[];
  connections: any[];
  attributes: any[];
  proceduralLogic: string;
  tutorials?: TutorialLink[];
}

export interface NodePin {
  name: string;
  type: 'exec' | 'bool' | 'float' | 'integer' | 'vector' | 'object' | 'string' | 'rotator' | 'transform' | 'pcg_data';
  value?: string;
}

export interface NodeData {
  id: string;
  name: string;
  type: 'event' | 'function' | 'macro' | 'variable' | 'flow' | 'audio' | 'pcg';
  x: number;
  y: number;
  inputs: NodePin[];
  outputs: { name: string; type: string }[];
}

export interface GraphConnection {
  fromNode: string;
  fromPin: string;
  toNode: string;
  toPin: string;
}

export interface BlueprintValidationReport {
  technicalAuditor: { status: 'Pass' | 'Fail', findings: string[] };
  logicFlowValidator: { status: 'Pass' | 'Fail', findings: string[] };
  functionalEngineer: { status: 'Pass' | 'Fail', findings: string[] };
  overallScore: number;
}

export interface BlueprintSpec {
  assetName: string;
  parentClass: string;
  components: string[];
  variables: { name: string; type: string; default: string; tooltip: string }[];
  eventGraph: { 
    eventName: string; 
    description: string;
    nodes: NodeData[];
    connections: GraphConnection[];
  }[];
  requiredAssets: { name: string; sourceType: string; importGuide: string }[];
  uiLayout?: string[];
  tutorials?: TutorialLink[];
  validationReport?: BlueprintValidationReport;
  activeMode?: GenMode;
}

export interface MaterialSpec {
  assetName: string;
  domain: string;
  blendMode: string;
  nodes: any[];
  connections: any[];
  tutorials?: TutorialLink[];
}

export interface EnhancedInputSpec {
  contextName: string;
  description: string;
  actions: { name: string; description: string; valueType: string }[];
  mappings: { actionName: string; key: string; modifiers: string[]; triggers: string[] }[];
  tutorials?: TutorialLink[];
}

export interface GamePlan {
  title: string;
  summary: string;
  targetPlatformRecommendations: string[];
  requiredPlugins?: string[];
  migrationNotes?: string[];
  phases: Phase[];
}

export interface Phase {
  phaseName: string;
  duration: string;
  goal: string;
  tasks: Task[];
  keyConcepts: string[];
  requiredPlugins?: string[];
}

export interface Task {
  title: string;
  description: string;
  folderPath: string;
  assetName: string;
  stepByStepGuide: string[];
  suggestedNodes?: string[];
  blueprintDetails?: {
    variables?: string[];
    components?: string[];
    keyNodes?: string[];
    propertySettings?: { component: string; property: string; value: string }[];
  };
  tutorials?: TutorialLink[];
  suggestedMarketAssets?: MarketplaceSuggestion[];
}

export interface UserInput {
  gameIdea: string;
  level: ExperienceLevel;
  genres: string[];
  platforms: string[];
  mechanics: string[];
  artStyle: string;
  lightingMethod: string;
  ueVersion: string;
  inputSystem: 'Enhanced Input' | 'Legacy Input';
  networking: 'Single Player' | 'Listen Server (Co-op)' | 'Dedicated Server';
  teamSize: number;
  template: UETemplate;
  assets: MarketAsset[];
  tier?: 'hobbyist' | 'indie' | 'studio';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AgentResponse {
  response: string;
  hasPlanUpdates: boolean;
  updatedPlan?: GamePlan;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  backstory: string;
  personality: string;
  visualDescription: string;
  location: string;
}

export interface CppCode {
  header: string;
  source: string;
  explanation: string;
}

export interface VisualPrompt {
  category: 'Environment' | 'Character' | 'Prop' | 'UI';
  prompt: string;
  title: string;
}

export interface Quest {
  id: string;
  title: string;
  type: 'Main' | 'Side' | 'Event';
  description: string;
  objectives: string[];
  rewards: string[];
  branchingOptions?: string[];
}

export interface DialogueLine {
  speaker: string;
  text: string;
  emotion?: string;
}

export interface DialogueScript {
  id: string;
  npcId: string;
  context: string;
  lines: DialogueLine[];
}

export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  type: 'Spawn' | 'Enemy' | 'Loot' | 'Boss' | 'Puzzle' | 'NPC';
  x: number;
  y: number;
  mapUri?: string;
}

export interface LevelLayout {
  id: string;
  name: string;
  description: string;
  visualPrompt: string;
  pointsOfInterest: PointOfInterest[];
  location?: string;
  imageBase64?: string;
}

export interface VisionImage {
  id: string;
  prompt: string;
  base64: string;
  category: string;
  timestamp: number;
}

export interface NarrativeData {
  quests: Quest[];
  npcs: NPC[];
  dialogues: Record<string, DialogueScript[]>;
}

export interface AgentFeedback {
  summary: string;
  flags: string[];
  recommendations: string[];
  score: number;
}

export interface ProducerFeedback extends AgentFeedback {
  timeToPrototype: string;
  estimatedBudgetRisk: 'Low' | 'Medium' | 'High';
}

export interface DesignReview {
  technicalDirector: AgentFeedback;
  artDirector: AgentFeedback;
  producer: ProducerFeedback;
}

export interface SavedProject {
  id: string;
  title: string;
  summary: string;
  genre: string;
  createdAt: number;
  lastModified: number;
  input: UserInput;
  plan: GamePlan;
  chatHistory: ChatMessage[];
  installedAssets?: MarketplaceSuggestion[];
  designReview?: DesignReview;
  overseerReport?: OverseerReport;
  blueprints?: Record<string, BlueprintSpec>;
  behaviorTrees?: Record<string, BehaviorTreeSpec>;
  materials?: Record<string, MaterialSpec>;
  inputs?: Record<string, EnhancedInputSpec>;
  cppCodes?: Record<string, CppCode>;
  t3dExports?: Record<string, string>;
  visionBoard?: VisionImage[];
  narrative?: NarrativeData;
  levelLayouts?: LevelLayout[];
  performanceReports?: PerformanceAnalysis[];
  metaSounds?: Record<string, MetaSoundSpec>;
  pcgs?: Record<string, PcgSpec>;
  driveSyncPath?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  provider: 'google' | 'email';
  isVerified: boolean;
  studioName?: string;
  primaryRole?: string;
  specialty?: string;
}
