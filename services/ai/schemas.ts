
import { Type, Schema } from "@google/genai";

export const overseerReportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallReadiness: { type: Type.NUMBER, description: "Total percentage of technical completion." },
    summary: { type: Type.STRING, description: "High-level overview of the project's health." },
    subsystems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pillar: { type: Type.STRING, enum: ['Logic', 'Visuals', 'AI', 'Systems'] },
          score: { type: Type.NUMBER },
          status: { type: Type.STRING, enum: ['Nominal', 'Incomplete', 'Critical Gap'] },
          details: { type: Type.STRING }
        },
        required: ["pillar", "score", "status", "details"]
      }
    },
    missingCriticalAssets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["name", "type", "reason"]
      }
    },
    technicalDebtAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestedNextAction: { type: Type.STRING }
  },
  required: ["overallReadiness", "summary", "subsystems", "missingCriticalAssets", "suggestedNextAction"]
};

export const planSchemaDef = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Professional project title" },
    summary: { type: Type.STRING, description: "Comprehensive technical summary" },
    targetPlatformRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Platform-specific architectural requirements"
    },
    requiredPlugins: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of all UE5 plugins that must be enabled (e.g., 'MotionWarping', 'Groom')"
    },
    migrationNotes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Critical steps for migrating GASP, ALS, or Lyra assets into the project."
    },
    globalProjectRequirements: {
      type: Type.OBJECT,
      properties: {
        namingConvention: { type: Type.STRING },
        requiredPlugins: { type: Type.ARRAY, items: { type: Type.STRING } },
        folderStructure: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    phases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phaseName: { type: Type.STRING },
          duration: { type: Type.STRING },
          goal: { type: Type.STRING },
          requiredPlugins: { type: Type.ARRAY, items: { type: Type.STRING } },
          technicalSubsystems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Deep UE5 systems used (e.g., 'Data Registry', 'Mass Entity', 'Iris Replication')"
          },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                folderPath: { type: Type.STRING },
                assetName: { type: Type.STRING },
                suggestedNodes: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Exact UE5 node names recommended for this task (e.g., 'Event BeginPlay', 'Add Movement Input')."
                },
                requiredFunctions: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT, 
                    properties: {
                      name: { type: Type.STRING },
                      parameters: { type: Type.ARRAY, items: { type: Type.STRING } },
                      logicDescription: { type: Type.STRING }
                    }
                  } 
                },
                stepByStepGuide: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exhaustive instructions including exact property names in the Details panel."
                },
                blueprintDetails: {
                  type: Type.OBJECT,
                  properties: {
                    variables: { type: Type.ARRAY, items: { type: Type.STRING } },
                    components: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keyNodes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    propertySettings: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          component: { type: Type.STRING, description: "The component name (e.g., 'CharacterMovement')" },
                          property: { type: Type.STRING, description: "The property name in the Details panel" },
                          value: { type: Type.STRING, description: "The required setting value" }
                        },
                        required: ["component", "property", "value"]
                      }
                    }
                  }
                }
              },
              required: ["title", "description", "folderPath", "assetName", "stepByStepGuide"]
            }
          }
        },
        required: ["phaseName", "duration", "goal", "tasks"]
      }
    }
  },
  required: ["title", "summary", "phases"]
};

export const planSchema: Schema = planSchemaDef as Schema;

export const compatibilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallStatus: { type: Type.STRING, enum: ['Compatible', 'Warnings', 'Critical Issues'] },
    warnings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          asset: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
          issue: { type: Type.STRING },
          fix: { type: Type.STRING }
        },
        required: ["asset", "severity", "issue", "fix"]
      }
    },
    architecturalAdvice: { type: Type.STRING }
  },
  required: ["overallStatus", "warnings", "architecturalAdvice"]
};

export const behaviorTreeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    assetName: { type: Type.STRING },
    blackboardAsset: { type: Type.STRING },
    rootNode: { type: Type.STRING },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Composite', 'Task', 'Decorator', 'Service'] },
          subType: { type: Type.STRING, enum: ['Selector', 'Sequence', 'SimpleParallel'] },
          description: { type: Type.STRING },
          children: { type: Type.ARRAY, items: { type: Type.STRING } },
          decorators: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    name: { type: Type.STRING }, 
                    condition: { type: Type.STRING } 
                },
                required: ["name", "condition"]
            } 
          },
          services: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    name: { type: Type.STRING }, 
                    logic: { type: Type.STRING } 
                },
                required: ["name", "logic"]
            } 
          }
        },
        required: ["id", "name", "type", "description"]
      }
    },
    blackboardKeys: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Bool', 'Float', 'Int', 'Vector', 'Rotator', 'String', 'Object', 'Class', 'Enum', 'Name'] },
          description: { type: Type.STRING }
        },
        required: ["name", "type", "description"]
      }
    },
    logicSummary: { type: Type.STRING }
  },
  required: ["assetName", "blackboardAsset", "rootNode", "nodes", "blackboardKeys", "logicSummary"]
};

export const blueprintSpecSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    assetName: { type: Type.STRING },
    parentClass: { type: Type.STRING },
    components: { type: Type.ARRAY, items: { type: Type.STRING } },
    variables: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          default: { type: Type.STRING },
          tooltip: { type: Type.STRING }
        },
        required: ["name", "type", "default", "tooltip"]
      }
    },
    eventGraph: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          eventName: { type: Type.STRING },
          description: { type: Type.STRING },
          nodes: { 
            type: Type.ARRAY, 
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['event', 'function', 'macro', 'variable', 'flow'] },
                inputs: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT, 
                        properties: { 
                            name: { type: Type.STRING }, 
                            type: { type: Type.STRING }, 
                            value: { type: Type.STRING } 
                        }, 
                        required: ["name", "type"] 
                    } 
                },
                outputs: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT, 
                        properties: { 
                            name: { type: Type.STRING }, 
                            type: { type: Type.STRING } 
                        }, 
                        required: ["name", "type"] 
                    } 
                }
              },
              required: ["id", "name", "type", "inputs", "outputs"]
            }
          },
          connections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fromNode: { type: Type.STRING },
                fromPin: { type: Type.STRING },
                toNode: { type: Type.STRING },
                toPin: { type: Type.STRING }
              },
              required: ["fromNode", "fromPin", "toNode", "toPin"]
            }
          }
        },
        required: ["eventName", "nodes", "connections"]
      }
    },
    requiredAssets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          sourceType: { type: Type.STRING },
          importGuide: { type: Type.STRING }
        },
        required: ["name", "sourceType"]
      }
    }
  },
  required: ["assetName", "parentClass", "components", "variables", "eventGraph", "requiredAssets"]
};

export const searchAgentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    suggestedQueries: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 highly optimized, human-like search queries for UE5 learning resources."
    },
    technicalReasoning: { type: Type.STRING, description: "Why these specific terms were chosen." }
  },
  required: ["suggestedQueries", "technicalReasoning"]
};

export const projectAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    genres: { type: Type.ARRAY, items: { type: Type.STRING } },
    platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
    mechanics: { type: Type.ARRAY, items: { type: Type.STRING } },
    artStyle: { type: Type.STRING },
    lightingMethod: { type: Type.STRING },
    ueVersion: { type: Type.STRING },
    inputSystem: { type: Type.STRING },
    networking: { type: Type.STRING },
    template: { type: Type.STRING },
    assets: { type: Type.ARRAY, items: { type: Type.STRING } },
    teamSize: { type: Type.NUMBER }
  },
  required: ["genres", "platforms", "mechanics", "artStyle", "lightingMethod", "ueVersion", "inputSystem", "networking", "template", "assets", "teamSize"]
};

export const conflictAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    conflicts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          affectedAssets: { type: Type.ARRAY, items: { type: Type.STRING } },
          conflictingClass: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          reason: { type: Type.STRING }
        },
        required: ['affectedAssets', 'conflictingClass', 'severity', 'reason']
      }
    },
    patchSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendedPatchAsset: { type: Type.STRING }
  },
  required: ['summary', 'conflicts', 'patchSteps', 'recommendedPatchAsset']
};

export const metaSoundSpecSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    assetName: { type: Type.STRING },
    description: { type: Type.STRING },
    nodes: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                id: { type: Type.STRING }, 
                name: { type: Type.STRING }, 
                type: { type: Type.STRING }, 
                inputs: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT, 
                        properties: { 
                            name: { type: Type.STRING }, 
                            type: { type: Type.STRING } 
                        },
                        required: ["name", "type"]
                    } 
                }, 
                outputs: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT, 
                        properties: { 
                            name: { type: Type.STRING }, 
                            type: { type: Type.STRING } 
                        },
                        required: ["name", "type"]
                    } 
                } 
            }, 
            required: ['id', 'name', 'type', 'inputs', 'outputs'] 
        } 
    },
    connections: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                fromNode: { type: Type.STRING }, 
                fromPin: { type: Type.STRING }, 
                toNode: { type: Type.STRING }, 
                toPin: { type: Type.STRING } 
            }, 
            required: ['fromNode', 'fromPin', 'toNode', 'toPin'] 
        } 
    },
    parameters: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                name: { type: Type.STRING }, 
                type: { type: Type.STRING }, 
                defaultValue: { type: Type.STRING } 
            },
            required: ["name", "type"]
        } 
    },
    dspLogic: { type: Type.STRING }
  },
  required: ['assetName', 'description', 'nodes', 'connections', 'dspLogic']
};

export const pcgSpecSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    assetName: { type: Type.STRING },
    description: { type: Type.STRING },
    nodes: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                id: { type: Type.STRING }, 
                name: { type: Type.STRING }, 
                type: { type: Type.STRING }, 
                settings: { type: Type.ARRAY, items: { type: Type.STRING } } 
            }, 
            required: ['id', 'name', 'type', 'settings'] 
        } 
    },
    connections: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                fromNode: { type: Type.STRING }, 
                fromPin: { type: Type.STRING }, 
                toNode: { type: Type.STRING }, 
                toPin: { type: Type.STRING } 
            }, 
            required: ['fromNode', 'fromPin', 'toNode', 'toPin'] 
        } 
    },
    attributes: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                name: { type: Type.STRING }, 
                type: { type: Type.STRING }, 
                description: { type: Type.STRING } 
            },
            required: ["name", "type"]
        } 
    },
    proceduralLogic: { type: Type.STRING }
  },
  required: ['assetName', 'description', 'nodes', 'connections', 'proceduralLogic']
};

export const performanceAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    score: { type: Type.NUMBER },
    metrics: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, value: { type: Type.STRING }, status: { type: Type.STRING, enum: ['Good', 'Warning', 'Critical'] } }, required: ['label', 'value', 'status'] } },
    bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] } }, required: ['title', 'description', 'complexity'] } }
  },
  required: ['summary', 'score', 'metrics', 'bottlenecks', 'recommendations']
};

export const designReviewSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    technicalDirector: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, flags: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, score: { type: Type.NUMBER } }, required: ["summary", "flags", "recommendations", "score"] },
    artDirector: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, flags: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, score: { type: Type.NUMBER } }, required: ["summary", "flags", "recommendations", "score"] },
    producer: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, flags: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, score: { type: Type.NUMBER }, timeToPrototype: { type: Type.STRING }, estimatedBudgetRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] } }, required: ["summary", "flags", "recommendations", "score", "timeToPrototype", "estimatedBudgetRisk"] }
  },
  required: ["technicalDirector", "artDirector", "producer"]
};

export const chatSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    response: { type: Type.STRING },
    hasPlanUpdates: { type: Type.BOOLEAN },
    updatedPlan: planSchemaDef as Schema
  },
  required: ["response", "hasPlanUpdates"]
};

export const materialSpecSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    assetName: { type: Type.STRING },
    domain: { type: Type.STRING, enum: ['Surface', 'UserInterface', 'PostProcess'] },
    blendMode: { type: Type.STRING, enum: ['Opaque', 'Masked', 'Translucent', 'Additive'] },
    nodes: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                id: { type: Type.STRING }, 
                name: { type: Type.STRING }, 
                type: { type: Type.STRING }, 
                properties: { type: Type.ARRAY, items: { type: Type.STRING } } 
            }, 
            required: ['id', 'name', 'type', 'properties'] 
        } 
    },
    connections: { 
        type: Type.ARRAY, 
        items: { 
            type: Type.OBJECT, 
            properties: { 
                fromNode: { type: Type.STRING }, 
                fromPin: { type: Type.STRING }, 
                toNode: { type: Type.STRING }, 
                toPin: { type: Type.STRING } 
            }, 
            required: ['fromNode', 'fromPin', 'toNode', 'toPin'] 
        } 
    }
  },
  required: ['assetName', 'domain', 'blendMode', 'nodes', 'connections']
};

export const enhancedInputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    contextName: { type: Type.STRING },
    description: { type: Type.STRING },
    actions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, valueType: { type: Type.STRING, enum: ['Boolean', 'Axis1D', 'Axis2D', 'Axis3D'] } }, required: ['name', 'description', 'valueType'] } },
    mappings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { actionName: { type: Type.STRING }, key: { type: Type.STRING }, modifiers: { type: Type.ARRAY, items: { type: Type.STRING } }, triggers: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['actionName', 'key', 'modifiers', 'triggers'] } }
  },
  required: ['contextName', 'description', 'actions', 'mappings']
};

export const enhancementSchema: Schema = {
  type: Type.OBJECT,
  properties: { enhancedConcept: { type: Type.STRING } },
  required: ["enhancedConcept"]
};

export const pythonScriptSchema: Schema = {
  type: Type.OBJECT,
  properties: { script: { type: Type.STRING }, usageGuide: { type: Type.STRING } },
  required: ["script", "usageGuide"]
};

export const cppCodeSchema: Schema = {
  type: Type.OBJECT,
  properties: { header: { type: Type.STRING }, source: { type: Type.STRING }, explanation: { type: Type.STRING } },
  required: ["header", "source", "explanation"]
};

export const visualPromptsSchema: Schema = {
  type: Type.OBJECT,
  properties: { prompts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, prompt: { type: Type.STRING }, title: { type: Type.STRING } }, required: ['category', 'prompt', 'title'] } } },
  required: ['prompts']
};

export const t3dResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: { t3d: { type: Type.STRING } },
  required: ["t3d"]
};

export const questListSchema: Schema = {
  type: Type.OBJECT,
  properties: { quests: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING }, objectives: { type: Type.ARRAY, items: { type: Type.STRING } }, rewards: { type: Type.ARRAY, items: { type: Type.STRING } }, branchingOptions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['title', 'type', 'description', 'objectives', 'rewards'] } } },
  required: ['quests']
};

export const npcListSchema: Schema = {
  type: Type.OBJECT,
  properties: { npcs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, backstory: { type: Type.STRING }, personality: { type: Type.STRING }, visualDescription: { type: Type.STRING }, location: { type: Type.STRING } }, required: ['name', 'role', 'backstory', 'personality', 'visualDescription', 'location'] } } },
  required: ['npcs']
};

export const dialogueSchema: Schema = {
  type: Type.OBJECT,
  properties: { context: { type: Type.STRING }, lines: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { speaker: { type: Type.STRING }, text: { type: Type.STRING }, emotion: { type: Type.STRING } }, required: ['speaker', 'text'] } } },
  required: ['context', 'lines']
};

export const levelLayoutSchema: Schema = {
  type: Type.OBJECT,
  properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, visualPrompt: { type: Type.STRING }, pointsOfInterest: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, type: { type: Type.STRING } }, required: ['name', 'description', 'type'] } } },
  required: ['name', 'description', 'visualPrompt', 'pointsOfInterest']
};
