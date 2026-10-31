// Base anatômica expandida e enriquecida para os 8 Sistemas do Corpo Humano no LabSim
// Baseada no esquema anatômico original do Open Anatomy Atlas (Cognition Lab SNUC)
// Ampliada com identificadores dos 8 sistemas, lateralidade, cores científicas e ontologia FMA

const SKELETON_COLOR = [0.90, 0.88, 0.80];
const MUSCLE_COLOR = [0.78, 0.26, 0.24];
const NERVOUS_COLOR = [0.65, 0.50, 0.95];
const CARDIO_COLOR = [0.92, 0.18, 0.22];
const RESP_COLOR = [0.45, 0.72, 0.85];
const DIGEST_COLOR = [0.92, 0.62, 0.25];
const URINARY_COLOR = [0.20, 0.75, 0.82];
const REPROD_COLOR = [0.88, 0.40, 0.68];

// Cada parte possui: id, label, pt, la, system, shape ('sphere'|'capsule'|'box'), size, pos, rot, color
const PARTS = [
  // ================= 1. SISTEMA ESQUELÉTICO =================
  { id: 'skull', label: 'Cranium / Skull', pt: 'Crânio', la: 'Cranium', fma: 'FMA 53672', system: 'skeletal', shape: 'sphere', size: [0.62], pos: [0, 7.3, 0], color: SKELETON_COLOR },
  { id: 'mandible', label: 'Mandible', pt: 'Mandíbula', la: 'Mandibula', fma: 'FMA 52748', system: 'skeletal', shape: 'box', size: [0.45, 0.25, 0.4], pos: [0, 6.85, 0.2], color: SKELETON_COLOR },
  { id: 'cervical_spine', label: 'Cervical Spine', pt: 'Coluna Cervical', la: 'Vertebrae cervicales', fma: 'FMA 11956', system: 'skeletal', shape: 'capsule', size: [0.12, 0.6], pos: [0, 6.6, 0], color: SKELETON_COLOR },
  { id: 'thoracic_spine', label: 'Thoracic Spine', pt: 'Coluna Torácica', la: 'Vertebrae thoracicae', fma: 'FMA 11957', system: 'skeletal', shape: 'capsule', size: [0.14, 1.6], pos: [0, 5.3, -0.1], color: SKELETON_COLOR },
  { id: 'lumbar_spine', label: 'Lumbar Spine', pt: 'Coluna Lombar', la: 'Vertebrae lumbales', fma: 'FMA 11958', system: 'skeletal', shape: 'capsule', size: [0.16, 1.0], pos: [0, 4.2, -0.1], color: SKELETON_COLOR },
  { id: 'sternum', label: 'Sternum', pt: 'Esterno', la: 'Sternum', fma: 'FMA 7485', system: 'skeletal', shape: 'box', size: [0.18, 0.9, 0.08], pos: [0, 5.4, 0.42], color: SKELETON_COLOR },
  { id: 'rib_cage', label: 'Rib Cage', pt: 'Caixa Torácica (Costelas)', la: 'Cavea thoracis', fma: 'FMA 7566', system: 'skeletal', shape: 'capsule', size: [0.55, 1.5], pos: [0, 5.3, 0], rot: [0, 0, Math.PI/2], color: SKELETON_COLOR },
  { id: 'clavicle_l', label: 'Left Clavicle', pt: 'Clavícula Esquerda', la: 'Clavicula sinistra', fma: 'FMA 13321', system: 'skeletal', shape: 'capsule', size: [0.08, 0.7], pos: [-0.45, 6.2, 0.15], rot: [0, 0, Math.PI/3], color: SKELETON_COLOR },
  { id: 'clavicle_r', label: 'Right Clavicle', pt: 'Clavícula Direita', la: 'Clavicula dextra', fma: 'FMA 13320', system: 'skeletal', shape: 'capsule', size: [0.08, 0.7], pos: [0.45, 6.2, 0.15], rot: [0, 0, -Math.PI/3], color: SKELETON_COLOR },
  { id: 'pelvis', label: 'Pelvis / Coxal Bones', pt: 'Pelve Óssea (Bacia)', la: 'Pelvis', fma: 'FMA 9578', system: 'skeletal', shape: 'box', size: [1.5, 0.65, 0.9], pos: [0, 3.6, 0], color: SKELETON_COLOR },
  { id: 'humerus_l', label: 'Left Humerus', pt: 'Úmero Esquerdo', la: 'Humerus sinister', fma: 'FMA 23466', system: 'skeletal', shape: 'capsule', size: [0.14, 1.4], pos: [-0.85, 4.9, 0], color: SKELETON_COLOR },
  { id: 'humerus_r', label: 'Right Humerus', pt: 'Úmero Direito', la: 'Humerus dexter', fma: 'FMA 23465', system: 'skeletal', shape: 'capsule', size: [0.14, 1.4], pos: [0.85, 4.9, 0], color: SKELETON_COLOR },
  { id: 'radius_ulna_l', label: 'Left Radius & Ulna', pt: 'Rádio e Ulna Esquerdos', la: 'Radius et ulna', fma: 'FMA 23474', system: 'skeletal', shape: 'capsule', size: [0.11, 1.3], pos: [-0.9, 3.5, 0], color: SKELETON_COLOR },
  { id: 'radius_ulna_r', label: 'Right Radius & Ulna', pt: 'Rádio e Ulna Direitos', la: 'Radius et ulna', fma: 'FMA 23473', system: 'skeletal', shape: 'capsule', size: [0.11, 1.3], pos: [0.9, 3.5, 0], color: SKELETON_COLOR },
  { id: 'hand_l', label: 'Left Hand Skeleton', pt: 'Esqueleto da Mão Esquerda', la: 'Ossa manus', fma: 'FMA 23899', system: 'skeletal', shape: 'sphere', size: [0.22], pos: [-0.92, 2.65, 0], color: SKELETON_COLOR },
  { id: 'hand_r', label: 'Right Hand Skeleton', pt: 'Esqueleto da Mão Direita', la: 'Ossa manus', fma: 'FMA 23898', system: 'skeletal', shape: 'sphere', size: [0.22], pos: [0.92, 2.65, 0], color: SKELETON_COLOR },
  { id: 'femur_l', label: 'Left Femur', pt: 'Fêmur Esquerdo', la: 'Femur sinistrum', fma: 'FMA 32261', system: 'skeletal', shape: 'capsule', size: [0.19, 1.9], pos: [-0.42, 2.3, 0], color: SKELETON_COLOR },
  { id: 'femur_r', label: 'Right Femur', pt: 'Fêmur Direito', la: 'Femur dextrum', fma: 'FMA 32260', system: 'skeletal', shape: 'capsule', size: [0.19, 1.9], pos: [0.42, 2.3, 0], color: SKELETON_COLOR },
  { id: 'tibia_fibula_l', label: 'Left Tibia & Fibula', pt: 'Tíbia e Fíbula Esquerda', la: 'Tibia et fibula', fma: 'FMA 32278', system: 'skeletal', shape: 'capsule', size: [0.15, 1.9], pos: [-0.42, 0.55, 0], color: SKELETON_COLOR },
  { id: 'tibia_fibula_r', label: 'Right Tibia & Fibula', pt: 'Tíbia e Fíbula Direita', la: 'Tibia et fibula', fma: 'FMA 32277', system: 'skeletal', shape: 'capsule', size: [0.15, 1.9], pos: [0.42, 0.55, 0], color: SKELETON_COLOR },
  { id: 'foot_l', label: 'Left Foot Skeleton', pt: 'Esqueleto do Pé Esquerdo', la: 'Ossa pedis', fma: 'FMA 32283', system: 'skeletal', shape: 'box', size: [0.26, 0.2, 0.55], pos: [-0.42, -0.5, 0.15], color: SKELETON_COLOR },
  { id: 'foot_r', label: 'Right Foot Skeleton', pt: 'Esqueleto do Pé Direito', la: 'Ossa pedis', fma: 'FMA 32282', system: 'skeletal', shape: 'box', size: [0.26, 0.2, 0.55], pos: [0.42, -0.5, 0.15], color: SKELETON_COLOR },

  // ================= 2. SISTEMA MUSCULAR =================
  { id: 'trapezius', label: 'Trapezius', pt: 'Músculo Trapézio', la: 'Musculus trapezius', fma: 'FMA 9626', system: 'muscular', shape: 'box', size: [0.95, 0.75, 0.3], pos: [0, 6.0, -0.3], color: MUSCLE_COLOR },
  { id: 'deltoid_l', label: 'Left Deltoid', pt: 'Deltóide Esquerdo', la: 'Musculus deltoideus', fma: 'FMA 32522', system: 'muscular', shape: 'sphere', size: [0.28], pos: [-0.72, 5.55, 0], color: MUSCLE_COLOR },
  { id: 'deltoid_r', label: 'Right Deltoid', pt: 'Deltóide Direito', la: 'Musculus deltoideus', fma: 'FMA 32521', system: 'muscular', shape: 'sphere', size: [0.28], pos: [0.72, 5.55, 0], color: MUSCLE_COLOR },
  { id: 'pectoralis', label: 'Pectoralis Major', pt: 'Peitoral Maior', la: 'Musculus pectoralis major', fma: 'FMA 9627', system: 'muscular', shape: 'box', size: [1.0, 0.6, 0.3], pos: [0, 5.6, 0.35], color: MUSCLE_COLOR },
  { id: 'biceps_l', label: 'Left Biceps Brachii', pt: 'Bíceps Braquial Esquerdo', la: 'Musculus biceps brachii', fma: 'FMA 37671', system: 'muscular', shape: 'capsule', size: [0.16, 1.0], pos: [-0.87, 4.95, 0.15], color: MUSCLE_COLOR },
  { id: 'biceps_r', label: 'Right Biceps Brachii', pt: 'Bíceps Braquial Direito', la: 'Musculus biceps brachii', fma: 'FMA 37670', system: 'muscular', shape: 'capsule', size: [0.16, 1.0], pos: [0.87, 4.95, 0.15], color: MUSCLE_COLOR },
  { id: 'rectus_abdominis', label: 'Rectus Abdominis', pt: 'Reto Abdominal', la: 'Musculus rectus abdominis', fma: 'FMA 9628', system: 'muscular', shape: 'box', size: [0.65, 1.1, 0.25], pos: [0, 4.4, 0.45], color: MUSCLE_COLOR },
  { id: 'quadriceps_l', label: 'Left Quadriceps Femoris', pt: 'Quadríceps Femoral Esquerdo', la: 'Musculus quadriceps femoris', fma: 'FMA 22429', system: 'muscular', shape: 'capsule', size: [0.24, 1.5], pos: [-0.42, 2.35, 0.2], color: MUSCLE_COLOR },
  { id: 'quadriceps_r', label: 'Right Quadriceps Femoris', pt: 'Quadríceps Femoral Direito', la: 'Musculus quadriceps femoris', fma: 'FMA 22428', system: 'muscular', shape: 'capsule', size: [0.24, 1.5], pos: [0.42, 2.35, 0.2], color: MUSCLE_COLOR },
  { id: 'gastrocnemius_l', label: 'Left Gastrocnemius', pt: 'Gastrocnêmio Esquerdo (Panturrilha)', la: 'Musculus gastrocnemius', fma: 'FMA 22542', system: 'muscular', shape: 'capsule', size: [0.18, 1.1], pos: [-0.42, 0.65, -0.18], color: MUSCLE_COLOR },
  { id: 'gastrocnemius_r', label: 'Right Gastrocnemius', pt: 'Gastrocnêmio Direito (Panturrilha)', la: 'Musculus gastrocnemius', fma: 'FMA 22541', system: 'muscular', shape: 'capsule', size: [0.18, 1.1], pos: [0.42, 0.65, -0.18], color: MUSCLE_COLOR },
  { id: 'gluteus_maximus_l', label: 'Left Gluteus Maximus', pt: 'Glúteo Máximo Esquerdo', la: 'Musculus gluteus maximus', fma: 'FMA 22315', system: 'muscular', shape: 'sphere', size: [0.38], pos: [-0.42, 3.5, -0.4], color: MUSCLE_COLOR },
  { id: 'gluteus_maximus_r', label: 'Right Gluteus Maximus', pt: 'Glúteo Máximo Direito', la: 'Musculus gluteus maximus', fma: 'FMA 22314', system: 'muscular', shape: 'sphere', size: [0.38], pos: [0.42, 3.5, -0.4], color: MUSCLE_COLOR },

  // ================= 3. SISTEMA NERVOSO =================
  { id: 'brain', label: 'Encephalon / Brain', pt: 'Encéfalo (Cérebro)', la: 'Encephalon', fma: 'FMA 50801', system: 'nervous', shape: 'sphere', size: [0.44], pos: [0, 7.35, -0.05], color: NERVOUS_COLOR },
  { id: 'cerebellum', label: 'Cerebellum', pt: 'Cerebelo', la: 'Cerebellum', fma: 'FMA 67944', system: 'nervous', shape: 'sphere', size: [0.24], pos: [0, 6.9, -0.25], color: [0.55, 0.40, 0.85] },
  { id: 'spinal_cord', label: 'Spinal Cord', pt: 'Medula Espinhal', la: 'Medulla spinalis', fma: 'FMA 7647', system: 'nervous', shape: 'capsule', size: [0.08, 2.6], pos: [0, 5.2, -0.15], color: NERVOUS_COLOR },
  { id: 'sciatic_nerve_l', label: 'Left Sciatic Nerve', pt: 'Nervo Ciático Esquerdo', la: 'Nervus ischiadicus', fma: 'FMA 19036', system: 'nervous', shape: 'capsule', size: [0.05, 1.8], pos: [-0.38, 2.2, -0.15], color: NERVOUS_COLOR },
  { id: 'sciatic_nerve_r', label: 'Right Sciatic Nerve', pt: 'Nervo Ciático Direito', la: 'Nervus ischiadicus', fma: 'FMA 19035', system: 'nervous', shape: 'capsule', size: [0.05, 1.8], pos: [0.38, 2.2, -0.15], color: NERVOUS_COLOR },

  // ================= 4. SISTEMA CARDIOVASCULAR =================
  { id: 'heart', label: 'Heart', pt: 'Coração', la: 'Cor', fma: 'FMA 7088', system: 'cardiovascular', shape: 'sphere', size: [0.34], pos: [-0.15, 5.6, 0.12], color: CARDIO_COLOR },
  { id: 'aorta', label: 'Aorta & Great Vessels', pt: 'Aorta e Vasos da Base', la: 'Aorta thoracica', fma: 'FMA 3734', system: 'cardiovascular', shape: 'capsule', size: [0.09, 1.4], pos: [-0.05, 5.3, 0.05], color: [0.98, 0.15, 0.15] },
  { id: 'inferior_vena_cava', label: 'Inferior Vena Cava', pt: 'Veia Cava Inferior', la: 'Vena cava inferior', fma: 'FMA 10951', system: 'cardiovascular', shape: 'capsule', size: [0.09, 1.4], pos: [0.08, 5.1, 0.05], color: [0.15, 0.35, 0.85] },
  { id: 'femoral_vessels_l', label: 'Left Femoral Vessels', pt: 'Vasos Femorais Esquerdos', la: 'Vasa femoralia', fma: 'FMA 70335', system: 'cardiovascular', shape: 'capsule', size: [0.06, 1.8], pos: [-0.32, 2.2, 0.05], color: CARDIO_COLOR },
  { id: 'femoral_vessels_r', label: 'Right Femoral Vessels', pt: 'Vasos Femorais Direitos', la: 'Vasa femoralia', fma: 'FMA 70334', system: 'cardiovascular', shape: 'capsule', size: [0.06, 1.8], pos: [0.32, 2.2, 0.05], color: CARDIO_COLOR },

  // ================= 5. SISTEMA RESPIRATÓRIO =================
  { id: 'trachea', label: 'Trachea & Larynx', pt: 'Traqueia e Laringe', la: 'Trachea et larynx', fma: 'FMA 7394', system: 'respiratory', shape: 'capsule', size: [0.1, 0.7], pos: [0, 6.35, 0.22], color: [0.65, 0.85, 0.95] },
  { id: 'lung_l', label: 'Left Lung', pt: 'Pulmão Esquerdo', la: 'Pulmo sinister', fma: 'FMA 7310', system: 'respiratory', shape: 'capsule', size: [0.32, 0.95], pos: [-0.55, 5.6, -0.05], color: RESP_COLOR },
  { id: 'lung_r', label: 'Right Lung', pt: 'Pulmão Direito', la: 'Pulmo dexter', fma: 'FMA 7309', system: 'respiratory', shape: 'capsule', size: [0.35, 0.95], pos: [0.55, 5.6, -0.05], color: RESP_COLOR },

  // ================= 6. SISTEMA DIGESTÓRIO =================
  { id: 'liver', label: 'Liver', pt: 'Fígado', la: 'Hepar', fma: 'FMA 7197', system: 'digestive', shape: 'box', size: [0.8, 0.48, 0.55], pos: [0.32, 4.75, 0.16], color: [0.65, 0.26, 0.22] },
  { id: 'stomach', label: 'Stomach', pt: 'Estômago', la: 'Gaster', fma: 'FMA 7148', system: 'digestive', shape: 'sphere', size: [0.33], pos: [-0.25, 4.65, 0.22], color: DIGEST_COLOR },
  { id: 'pancreas', label: 'Pancreas', pt: 'Pâncreas', la: 'Pancreas', fma: 'FMA 7198', system: 'digestive', shape: 'box', size: [0.45, 0.15, 0.18], pos: [-0.05, 4.5, 0.05], color: [0.95, 0.78, 0.35] },
  { id: 'intestines', label: 'Small & Large Intestines', pt: 'Intestino Delgado e Grosso', la: 'Intestinum tenue et crassum', fma: 'FMA 7199', system: 'digestive', shape: 'sphere', size: [0.5], pos: [0, 4.0, 0.18], color: DIGEST_COLOR },

  // ================= 7. SISTEMA URINÁRIO =================
  { id: 'kidney_l', label: 'Left Kidney', pt: 'Rim Esquerdo', la: 'Ren sinister', fma: 'FMA 7208', system: 'urinary', shape: 'capsule', size: [0.12, 0.32], pos: [-0.45, 4.5, -0.3], color: URINARY_COLOR },
  { id: 'kidney_r', label: 'Right Kidney', pt: 'Rim Direito', la: 'Ren dexter', fma: 'FMA 7207', system: 'urinary', shape: 'capsule', size: [0.12, 0.32], pos: [0.45, 4.4, -0.3], color: URINARY_COLOR },
  { id: 'bladder', label: 'Urinary Bladder', pt: 'Bexiga Urinária', la: 'Vesica urinaria', fma: 'FMA 15900', system: 'urinary', shape: 'sphere', size: [0.22], pos: [0, 3.45, 0.25], color: [0.25, 0.85, 0.90] },

  // ================= 8. SISTEMA REPRODUTOR =================
  { id: 'reproductive_organs', label: 'Reproductive System', pt: 'Órgãos Reprodutores', la: 'Systema genitale', fma: 'FMA 280556', system: 'reproductive', shape: 'box', size: [0.35, 0.32, 0.32], pos: [0, 3.2, 0.22], color: REPROD_COLOR },
];

// O modelo foi desenhado com a esquerda do paciente em -X.
// Invertemos para que a esquerda do paciente fique em +X (visão anterior anatômica padrão).
for (const p of PARTS) p.pos[0] = -p.pos[0];

if (typeof module !== 'undefined') module.exports = { PARTS };
if (typeof window !== 'undefined') window.PARTS = PARTS;
