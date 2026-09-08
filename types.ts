
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

export interface BlueprintFunction {
  name: string;
  parameters: string[];
  returnType?: string;
  logicDescription: string;
  isPublic?: boolean;
  category?: string;
  implementationTarget?: string; // Explicitly links function to a specific Blueprint asset
}

export interface BlueprintVariable {
  name: string;
  type: string;
  default: string;
  tooltip?: string;
  isExposed?: boolean;
}

export interface BlueprintMacro {
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

export interface BlueprintDispatcher {
  name: string;
  parameters: string[];
}

export interface Task {
  title: string;
  description: string;
  folderPath: string;
  assetName: string;
  stepByStepGuide: string[];
  suggestedNodes?: string[];
  requiredFunctions?: BlueprintFunction[];
  blueprintDetails?: {
    variables?: BlueprintVariable[];
    components?: string[];
    propertySettings?: { component: string; property: string; value: string }[];
  };
  tutorials?: TutorialLink[];
  suggestedMarketAssets?: MarketplaceSuggestion[];
}

export interface BlueprintSpec {
  assetName: string;
  parentClass: string;
  components: string[];
  variables: BlueprintVariable[];
  functions: BlueprintFunction[];
  macros?: BlueprintMacro[];
  dispatchers?: BlueprintDispatcher[];
  eventGraph: { 
    eventName: string; 
    description: string;
    nodes: NodeData[];
    connections: GraphConnection[];
  }[];
  requiredAssets: { name: string; sourceType: string; importGuide: string }[];
  validationReport?: BlueprintValidationReport;
  activeMode?: GenMode;
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
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
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
  blueprints?: Record<string, BlueprintSpec>;
  behaviorTrees?: Record<string, BehaviorTreeSpec>;
  materials?: Record<string, MaterialSpec>;
  inputs?: Record<string, EnhancedInputSpec>;
  metaSounds?: Record<string, MetaSoundSpec>;
  pcgs?: Record<string, PcgSpec>;
  cppCodes?: Record<string, CppCode>;
  t3dExports?: Record<string, string>;
  visionBoard?: VisionImage[];
  narrative?: NarrativeData;
  levelLayouts?: LevelLayout[];
  performanceReports?: PerformanceAnalysis[];
  overseerReport?: OverseerReport;
  driveSyncPath?: string;
  installedAssets?: MarketplaceSuggestion[];
  designReview?: DesignReview;
}

export interface TutorialLink {
  uri: string;
  title: string;
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

export interface NodeData {
  id: string;
  name: string;
  type: 'event' | 'function' | 'macro' | 'variable' | 'flow' | 'audio' | 'pcg';
  x: number;
  y: number;
  inputs: { name: string; type: string; value?: string }[];
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

export interface SubsystemStatus {
  pillar: string;
  score: number;
  status: string;
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

export interface BehaviorTreeNode {
  id: string;
  name: string;
  type: 'Composite' | 'Task' | 'Decorator' | 'Service';
  subType?: 'Selector' | 'Sequence';
  description: string;
  children?: string[];
  decorators?: { name: string; condition: string }[];
  services?: { name: string }[];
}

export interface BehaviorTreeSpec {
  assetName: string;
  blackboardAsset: string;
  rootNode: string;
  nodes: Record<string, BehaviorTreeNode>;
  blackboardKeys: { name: string; type: string; description: string }[];
  logicSummary: string;
  validationReport?: BlueprintValidationReport;
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

export interface CppCode {
  header: string;
  source: string;
  explanation: string;
}

export interface VisionImage {
  id: string;
  prompt: string;
  base64: string;
  category: string;
  timestamp: number;
}

export interface VisualPrompt {
  category: string;
  prompt: string;
  title: string;
}

export interface NarrativeData {
  quests: Quest[];
  npcs: NPC[];
  dialogues: Record<string, DialogueScript[]>;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  personality: string;
  backstory: string;
  visualDescription: string;
  location: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  objectives: string[];
  rewards: string[];
}

export interface DialogueScript {
  id: string;
  npcId: string;
  context: string;
  lines: { speaker: string; text: string; emotion?: string }[];
}

export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  type: 'Spawn' | 'Enemy' | 'Boss' | 'Loot' | 'Puzzle' | 'Point' | 'NavMesh' | 'Volume';
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

export interface PerformanceAnalysis {
  id: string;
  timestamp: number;
  image: string;
  summary: string;
  score: number;
  metrics: { label: string; value: string; status: string }[];
  bottlenecks: string[];
  recommendations: { title: string; description: string; complexity: string }[];
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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  provider: string;
  isVerified: boolean;
  studioName?: string;
  primaryRole?: string;
  specialty?: string;
}

export interface ConflictAnalysis {
  summary: string;
  conflicts: {
    affectedAssets: string[];
    conflictingClass: string;
    severity: 'Low' | 'Medium' | 'High';
    reason: string;
  }[];
  patchSteps: string[];
  recommendedPatchAsset: string;
}

export interface AgentResponse {
  response: string;
  hasPlanUpdates: boolean;
  updatedPlan?: GamePlan;
}

export interface RevisionTrendPoint {
  revision: string;
  revisionNumber: number;
  timestamp: string;
  assetName: string;
  cpuCostMs: number;
  memoryMb: number;
  gpuCostMs: number;
  drawCalls: number;
  changeDescription: string;
  eventTickActive: boolean;
  nodeCount: number;
}

export interface AssetResourceMetric {
  assetName: string;
  assetType: 'Blueprint' | 'Material' | 'PCG' | 'MetaSound' | 'BehaviorTree' | 'EnhancedInput';
  cpuCostMs: number; // estimated GameThread / tick time in ms
  gpuCostMs: number; // estimated RenderThread / shader time in ms
  memoryMb: number; // estimated RAM/VRAM footprint in MB
  drawCalls: number; // estimated draw call contribution per frame
  tickLoadPercent: number; // % of CPU tick frame budget
  shaderInstructions?: number;
  complexityScore: number; // 0-100 scale
  status: 'Nominal' | 'Warning' | 'Critical';
  warnings: string[];
  optimizationTips: string[];
  ue5ConsoleCommands: string[];
  nativizationCandidate: boolean;
}

export interface RefactoringStep {
  category: 'Blueprint Graph' | 'Memory / Hard References' | 'Material / Shaders' | 'Audio / DSP' | 'C++ Nativization' | 'Ticking & Timers' | 'Draw Calls & Geometry';
  title: string;
  description: string;
  beforePattern?: string;
  afterPattern?: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
}

export interface AIOptimizeSuggestion {
  assetName: string;
  assetType: 'Blueprint' | 'Material' | 'PCG' | 'MetaSound' | 'BehaviorTree' | 'EnhancedInput';
  summary: string;
  primaryBottleneck: string;
  severity: 'Critical' | 'Warning' | 'Nominal';
  estimatedSavings: {
    cpuMsSaved: number;
    gpuMsSaved: number;
    memoryMbSaved: number;
    drawCallsSaved: number;
    headroomGainPercent: number;
  };
  refactoringSteps: RefactoringStep[];
  recommendedCVars: string[];
  architectActionPrompt?: string;
  codeOrNodeDiff?: {
    language: 'blueprint' | 'hlsl' | 'cpp' | 'json';
    before: string;
    after: string;
    explanation: string;
  };
}

export interface PlatformBudgetConfig {
  id: string;
  name: string;
  targetFps: number;
  targetFrameTimeMs: number;
  maxCpuBudgetMs: number;
  maxGpuBudgetMs: number;
  maxDrawCalls: number;
  maxVramMb: number;
  description: string;
}

export interface ProjectResourceSummary {
  totalCpuMs: number;
  totalGpuMs: number;
  totalMemoryMb: number;
  totalDrawCalls: number;
  cpuPercent: number;
  gpuPercent: number;
  memoryPercent: number;
  drawCallsPercent: number;
  healthScore: number;
  criticalAssetCount: number;
  warningAssetCount: number;
  nominalAssetCount: number;
  topCpuBottlenecks: AssetResourceMetric[];
  topGpuBottlenecks: AssetResourceMetric[];
  topMemoryBottlenecks: AssetResourceMetric[];
}
