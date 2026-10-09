export type ElementType = 'Phong' | 'Hoa' | 'Bang' | 'Loi' | 'Nguyet';
export type HeroRole = 'DPS' | 'TANK' | 'MAGE' | 'SUPPORT' | 'ASSASSIN' | 'COMMANDER';
export type HeroRarity = 'UR' | 'SSR' | 'SR' | 'R';
export type TargetScope = 'SINGLE_ENEMY' | 'ROW_ENEMIES' | 'COLUMN_ENEMIES' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES' | 'SELF';

export type StatusEffectType = 
  | 'STUN'        // Choáng - skip turn
  | 'FREEZE'      // Đóng băng - skip turn
  | 'BURN'        // Thiêu đốt - DoT (Fire dmg at turn start)
  | 'POISON'      // Độc - DoT & atk debuff
  | 'SHIELD'      // Khiên - absorbs dmg
  | 'ATK_BUFF'    // Tăng công (+30% dmg)
  | 'DEF_DOWN'    // Giảm thủ (-30% def)
  | 'SPEED_BUFF'  // Tăng tốc (+25% speed)
  | 'DEFENDING';  // Thủ - giảm 50% dmg

export interface StatusEffect {
  type: StatusEffectType;
  name: string;
  duration: number; // in turns
  value?: number;   // shield amount or dot value
  icon: string;
  color: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  type: 'BASIC' | 'SKILL_1' | 'SKILL_2' | 'ULTIMATE';
  icon: string;
  spCost: number;       // SP or Energy cost (0 for basic, 2-3 for active skills)
  rageCost: number;     // 100 for ultimate, 0 for normal
  rageGain: number;     // +25 for basic attack
  cooldown: number;     // in turns
  targetScope: TargetScope;
  targetDescription: string;
  desc: string;
  multiplier: number;   // e.g. 1.0 = 100% Atk, 2.5 = 250% Atk
  healMultiplier?: number;
  shieldMultiplier?: number;
  effectType?: StatusEffectType;
  effectChance?: number; // 0..1
  effectDuration?: number;
  cutinType?: 'PHONG_DRAGON' | 'HOA_PHOENIX' | 'BANG_ICE' | 'LOI_THUNDER' | 'NGUYET_ILLUSION';
}

export interface HeroDefinition {
  id: string;
  name: string;
  title: string;
  element: ElementType;
  role: HeroRole;
  rarity: HeroRarity;
  cardImage: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpeed: number; // Initiative speed
  critRate: number; // 0..1
  quote: string;
  spriteActions: Record<string, string>;
  skills: {
    basic: SkillDefinition;
    skill1: SkillDefinition;
    skill2: SkillDefinition;
    ultimate: SkillDefinition;
  };
}

export const HERO_DEFINITIONS: Record<string, HeroDefinition> = {
  hero_trieu_van: {
    id: 'hero_trieu_van',
    name: 'Triệu Vân',
    title: 'Thường Sơn Triệu Tử Long',
    element: 'Phong',
    role: 'ASSASSIN',
    rarity: 'UR',
    cardImage: 'hero_trieu_van_card',
    baseHp: 1900,
    baseAtk: 530,
    baseDef: 210,
    baseSpeed: 38,
    critRate: 0.35,
    quote: 'Long đảm thương ngân, một mình một ngựa phá vạn trùng vây!',
    spriteActions: {
      IDLE: 'hero_trieu_van_sprite_idle',
      ATTACK: 'hero_trieu_van_sprite_attack',
      HURT: 'hero_trieu_van_sprite_hurt',
      DEATH: 'hero_trieu_van_sprite_death',
    },
    skills: {
      basic: {
        id: 'tv_basic',
        name: 'Thương Kích Cơ Bản',
        type: 'BASIC',
        icon: '🗡️',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Đâm thương uy lực gây 110% sát thương Phong và tích nạp +25 Nộ Khí.',
        multiplier: 1.1,
      },
      skill1: {
        id: 'tv_s1',
        name: 'Long Đảm Đột Kích',
        type: 'SKILL_1',
        icon: '🌪️',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 2,
        targetScope: 'ROW_ENEMIES',
        targetDescription: 'Toàn hàng ngang địch',
        desc: 'Quét thương gió bão xuyên suốt hàng ngang địch gây 160% sát thương Phong, giảm 30% Giáp trong 2 lượt.',
        multiplier: 1.6,
        effectType: 'DEF_DOWN',
        effectChance: 0.8,
        effectDuration: 2,
      },
      skill2: {
        id: 'tv_s2',
        name: 'Phong Hành Tuyệt Bộ',
        type: 'SKILL_2',
        icon: '⚡',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 3,
        targetScope: 'SELF',
        targetDescription: 'Bản thân',
        desc: 'Nhập phong thần tốc, tăng 40% Tốc Độ và 30% Tỉ Lệ Bạo Kích trong 2 lượt.',
        multiplier: 0,
        effectType: 'SPEED_BUFF',
        effectChance: 1.0,
        effectDuration: 2,
      },
      ultimate: {
        id: 'tv_ult',
        name: 'Long Đảm Phá Quân Thần Long',
        type: 'ULTIMATE',
        icon: '🐉',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ENEMIES',
        targetDescription: 'Toàn bộ kẻ địch',
        desc: 'Triệu hồi Thần Long Phong Bão càn quét toàn bộ quân địch gây 280% sát thương bạo kích cực đại!',
        multiplier: 2.8,
        cutinType: 'PHONG_DRAGON',
      },
    },
  },

  hero_quan_vu: {
    id: 'hero_quan_vu',
    name: 'Quan Vũ',
    title: 'Võ Thánh Tráng Liệt',
    element: 'Hoa',
    role: 'DPS',
    rarity: 'UR',
    cardImage: 'hero_quan_vu_card',
    baseHp: 2200,
    baseAtk: 560,
    baseDef: 240,
    baseSpeed: 32,
    critRate: 0.30,
    quote: 'Thanh Long xuất thế, vạn tướng qui hàng!',
    spriteActions: {
      IDLE: 'hero_quan_vu_sprite_idle',
      ATTACK: 'hero_quan_vu_sprite_sword_attack',
      HURT: 'hero_quan_vu_sprite_hurt',
      DEATH: 'hero_quan_vu_sprite_death',
    },
    skills: {
      basic: {
        id: 'qv_basic',
        name: 'Đao Trảm Liệt Hỏa',
        type: 'BASIC',
        icon: '⚔️',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Vung đao rực lửa gây 120% sát thương Hỏa và nạp +25 Nộ.',
        multiplier: 1.2,
      },
      skill1: {
        id: 'qv_s1',
        name: 'Yểm Nguyệt Hỏa Trảm',
        type: 'SKILL_1',
        icon: '🔥',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 2,
        targetScope: 'COLUMN_ENEMIES',
        targetDescription: 'Toàn cột dọc địch',
        desc: 'Bổ đao cuồng nộ xé toạc hàng dọc gây 185% sát thương Hỏa và gây Thiêu Đốt trong 2 lượt.',
        multiplier: 1.85,
        effectType: 'BURN',
        effectChance: 0.9,
        effectDuration: 2,
      },
      skill2: {
        id: 'qv_s2',
        name: 'Võ Thánh Chiến Ý',
        type: 'SKILL_2',
        icon: '💥',
        spCost: 3,
        rageCost: 0,
        rageGain: 20,
        cooldown: 3,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Tiếng gầm võ thánh kích phát sĩ khí, tăng 35% Công cho toàn đội trong 2 lượt.',
        multiplier: 0,
        effectType: 'ATK_BUFF',
        effectChance: 1.0,
        effectDuration: 2,
      },
      ultimate: {
        id: 'qv_ult',
        name: 'Thanh Long Yểm Nguyệt Phượng Hoàng',
        type: 'ULTIMATE',
        icon: '🦅',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch chỉ định',
        desc: 'Kích hoạt Liệt Hỏa Chu Tước giáng đao diệt thế gây 380% sát thương Hỏa hủy diệt, phá hủy hoàn toàn Khiên chắn!',
        multiplier: 3.8,
        cutinType: 'HOA_PHOENIX',
      },
    },
  },

  hero_truong_phi: {
    id: 'hero_truong_phi',
    name: 'Trương Phi',
    title: 'Vạn Nhân Địch Dũng Tướng',
    element: 'Bang',
    role: 'TANK',
    rarity: 'SSR',
    cardImage: 'hero_truong_phi_card',
    baseHp: 2600,
    baseAtk: 420,
    baseDef: 310,
    baseSpeed: 28,
    critRate: 0.20,
    quote: 'Yên Nhân Trương Dực Đức ở đây, ai dám liều chết?!',
    spriteActions: {
      IDLE: 'hero_truong_phi_sprite_idle',
      ATTACK: 'hero_truong_phi_sprite_attack',
      HURT: 'hero_truong_phi_sprite_hurt',
      DEATH: 'hero_truong_phi_sprite_death',
    },
    skills: {
      basic: {
        id: 'tp_basic',
        name: 'Bát Xà Mâu Kích',
        type: 'BASIC',
        icon: '🔱',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Đâm xà mâu băng hàn gây 105% sát thương Băng và nạp +25 Nộ.',
        multiplier: 1.05,
      },
      skill1: {
        id: 'tp_s1',
        name: 'Hàn Băng Thần Thuẫn',
        type: 'SKILL_1',
        icon: '🛡️',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 3,
        targetScope: 'SELF',
        targetDescription: 'Bản thân',
        desc: 'Ngưng kết băng giáp tạo Hộ Thuẫn hấp thụ 500 sát thương và tăng 40% Giáp trong 2 lượt.',
        multiplier: 0,
        shieldMultiplier: 0.25,
        effectType: 'SHIELD',
        effectChance: 1.0,
        effectDuration: 2,
      },
      skill2: {
        id: 'tp_s2',
        name: 'Đoạt Mệnh Xà Mâu',
        type: 'SKILL_2',
        icon: '❄️',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 2,
        targetScope: 'ROW_ENEMIES',
        targetDescription: 'Toàn hàng ngang địch',
        desc: 'Quét mâu băng giá làm chậm và có 50% cơ hội Đóng Băng hàng ngang địch trong 1 lượt.',
        multiplier: 1.4,
        effectType: 'FREEZE',
        effectChance: 0.5,
        effectDuration: 1,
      },
      ultimate: {
        id: 'tp_ult',
        name: 'Trường Bản Tuyệt Băng Gầm',
        type: 'ULTIMATE',
        icon: '🧊',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ENEMIES',
        targetDescription: 'Toàn bộ kẻ địch',
        desc: 'Tiếng gầm rung chuyển cầu Trường Bản đóng băng vĩnh cửu gây 220% sát thương Băng và Choáng 1 lượt!',
        multiplier: 2.2,
        effectType: 'STUN',
        effectChance: 0.8,
        effectDuration: 1,
        cutinType: 'BANG_ICE',
      },
    },
  },

  hero_gia_cat_luong: {
    id: 'hero_gia_cat_luong',
    name: 'Gia Cát Lượng',
    title: 'Ngọa Long Tiên Sinh',
    element: 'Loi',
    role: 'MAGE',
    rarity: 'UR',
    cardImage: 'hero_gia_cat_luong_card',
    baseHp: 1700,
    baseAtk: 600,
    baseDef: 180,
    baseSpeed: 34,
    critRate: 0.25,
    quote: 'Mượn gió đông phạt ngụy, định mưu bình thiên hạ!',
    spriteActions: {
      IDLE: 'hero_gia_cat_luong_sprite_idle',
      ATTACK: 'hero_gia_cat_luong_sprite_shoot',
      HURT: 'hero_gia_cat_luong_sprite_hurt',
      DEATH: 'hero_gia_cat_luong_sprite_death',
    },
    skills: {
      basic: {
        id: 'gcl_basic',
        name: 'Vũ Phiến Lôi Đạn',
        type: 'BASIC',
        icon: '🪶',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Quạt lông phóng tia sét gây 115% sát thương Lôi và nạp +25 Nộ.',
        multiplier: 1.15,
      },
      skill1: {
        id: 'gcl_s1',
        name: 'Kỳ Môn Độn Giáp',
        type: 'SKILL_1',
        icon: '🌀',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 2,
        targetScope: 'ROW_ENEMIES',
        targetDescription: 'Hàng ngang địch',
        desc: 'Bày trận pháp sấm lôi gây 170% sát thương Lôi và làm Choáng 1 lượt.',
        multiplier: 1.7,
        effectType: 'STUN',
        effectChance: 0.6,
        effectDuration: 1,
      },
      skill2: {
        id: 'gcl_s2',
        name: 'Đông Phong Hộ Trận',
        type: 'SKILL_2',
        icon: '💨',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 3,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Mượn gió đông tăng 30% Tốc Độ và hồi 15 Nộ cho toàn đội.',
        multiplier: 0,
        effectType: 'SPEED_BUFF',
        effectChance: 1.0,
        effectDuration: 2,
      },
      ultimate: {
        id: 'gcl_ult',
        name: 'Bát Trận Đồ Cửu Thiên Lôi Điện',
        type: 'ULTIMATE',
        icon: '⚡',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ENEMIES',
        targetDescription: 'Toàn bộ kẻ địch',
        desc: 'Triệu hồi sấm sét cửu thiên giáng thế gây 270% sát thương Lôi toàn diện và làm Choáng toàn bộ kẻ địch!',
        multiplier: 2.7,
        effectType: 'STUN',
        effectChance: 0.9,
        effectDuration: 1,
        cutinType: 'LOI_THUNDER',
      },
    },
  },

  hero_dieu_thuyen: {
    id: 'hero_dieu_thuyen',
    name: 'Điêu Thuyền',
    title: 'Tuyệt Sắc Bế Nguyệt',
    element: 'Nguyet',
    role: 'SUPPORT',
    rarity: 'SSR',
    cardImage: 'hero_dieu_thuyen_card',
    baseHp: 1750,
    baseAtk: 410,
    baseDef: 200,
    baseSpeed: 36,
    critRate: 0.20,
    quote: 'Hồng nhan tri kỷ, nhất tiếu khuynh thành...',
    spriteActions: {
      IDLE: 'hero_dieu_thuyen_sprite_idle',
      ATTACK: 'hero_dieu_thuyen_sprite_attack',
      HURT: 'hero_dieu_thuyen_sprite_hurt',
      DEATH: 'hero_dieu_thuyen_sprite_death',
    },
    skills: {
      basic: {
        id: 'dt_basic',
        name: 'Lụa Đào Bế Nguyệt',
        type: 'BASIC',
        icon: '🌸',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Phất dải lụa gây 100% sát thương Nguyệt và nạp +25 Nộ.',
        multiplier: 1.0,
      },
      skill1: {
        id: 'dt_s1',
        name: 'Khuynh Quốc Trầm Ngư',
        type: 'SKILL_1',
        icon: '🌙',
        spCost: 2,
        rageCost: 0,
        rageGain: 20,
        cooldown: 2,
        targetScope: 'SINGLE_ALLY',
        targetDescription: '1 Đồng minh chỉ định',
        desc: 'Điệu múa chữa lành hồi phục 35% Máu tối đa và nạp ngay +35 Nộ cho đồng minh!',
        multiplier: 0,
        healMultiplier: 0.35,
      },
      skill2: {
        id: 'dt_s2',
        name: 'Bế Nguyệt Mê Hồn',
        type: 'SKILL_2',
        icon: '✨',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 3,
        targetScope: 'ROW_ENEMIES',
        targetDescription: 'Hàng ngang địch',
        desc: 'Huyễn thuật mê hoặc khiến kẻ địch nhiễm Độc bí thuật và giảm 30% Công trong 2 lượt.',
        multiplier: 1.2,
        effectType: 'POISON',
        effectChance: 0.85,
        effectDuration: 2,
      },
      ultimate: {
        id: 'dt_ult',
        name: 'Khuynh Thành Bế Nguyệt Ảo Ảnh',
        type: 'ULTIMATE',
        icon: '🔮',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Vũ khúc bế nguyệt hồi 40% Máu tối đa cho toàn đội, xóa sạch mọi hiệu ứng xấu và tăng 50 Nộ!',
        multiplier: 0,
        healMultiplier: 0.40,
        cutinType: 'NGUYET_ILLUSION',
      },
    },
  },

  hero_luu_bi: {
    id: 'hero_luu_bi',
    name: 'Lưu Bị',
    title: 'Chiêu Liệt Hoàng Đế',
    element: 'Nguyet',
    role: 'SUPPORT',
    rarity: 'SR',
    cardImage: 'hero_luu_bi_card',
    baseHp: 1950,
    baseAtk: 400,
    baseDef: 230,
    baseSpeed: 30,
    critRate: 0.15,
    quote: 'Lấy nhân nghĩa phục thiên hạ, vạn dân thái bình!',
    spriteActions: {
      IDLE: 'hero_luu_bi_sprite_idle',
      ATTACK: 'hero_luu_bi_sprite_sword_attack',
      HURT: 'hero_luu_bi_sprite_hurt',
      DEATH: 'hero_luu_bi_sprite_death',
    },
    skills: {
      basic: {
        id: 'lb_basic',
        name: 'Song Cổ Kiếm Pháp',
        type: 'BASIC',
        icon: '⚔️',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Song kiếm trảm kích gây 105% sát thương và nạp +25 Nộ.',
        multiplier: 1.05,
      },
      skill1: {
        id: 'lb_s1',
        name: 'Nhân Đức Hồi Phục',
        type: 'SKILL_1',
        icon: '💚',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 2,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Hào quang nhân đức hồi 25% Máu tối đa cho toàn đội minh.',
        multiplier: 0,
        healMultiplier: 0.25,
      },
      skill2: {
        id: 'lb_s2',
        name: 'Đào Viên Kết Nghĩa',
        type: 'SKILL_2',
        icon: '🛡️',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 3,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Lời thề vườn đào ban Khiên 400 sát thương cho toàn đội minh trong 2 lượt.',
        multiplier: 0,
        shieldMultiplier: 0.2,
        effectType: 'SHIELD',
        effectChance: 1.0,
        effectDuration: 2,
      },
      ultimate: {
        id: 'lb_ult',
        name: 'Hoàng Đế Nhân Nghĩa Tỏa Sáng',
        type: 'ULTIMATE',
        icon: '👑',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Đế vương hào quang hồi phục 50% Máu và tăng 40% Giáp cho toàn quân trong 3 lượt!',
        multiplier: 0,
        healMultiplier: 0.5,
        cutinType: 'NGUYET_ILLUSION',
      },
    },
  },

  hero_tao_thao: {
    id: 'hero_tao_thao',
    name: 'Tào Tháo',
    title: 'Ngụy Võ Đế Kiêu Hùng',
    element: 'Bang',
    role: 'COMMANDER',
    rarity: 'SSR',
    cardImage: 'hero_tao_thao_card',
    baseHp: 2050,
    baseAtk: 490,
    baseDef: 250,
    baseSpeed: 33,
    critRate: 0.25,
    quote: 'Thà ta phụ người thiên hạ, chứ không để thiên hạ phụ ta!',
    spriteActions: {
      IDLE: 'hero_tao_thao_sprite_idle',
      ATTACK: 'hero_tao_thao_sprite_sword_attack',
      HURT: 'hero_tao_thao_sprite_hurt',
      DEATH: 'hero_tao_thao_sprite_death',
    },
    skills: {
      basic: {
        id: 'tt_basic',
        name: 'Ỷ Thiên Kiếm Trảm',
        type: 'BASIC',
        icon: '🗡️',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Chém kiếm Ỷ Thiên gây 115% sát thương và tích +25 Nộ.',
        multiplier: 1.15,
      },
      skill1: {
        id: 'tt_s1',
        name: 'Bá Giả Uy Nghi',
        type: 'SKILL_1',
        icon: '👑',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 2,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Tăng 30% Công và 20% Tỉ Lệ Bạo Kích cho toàn đội trong 2 lượt.',
        multiplier: 0,
        effectType: 'ATK_BUFF',
        effectChance: 1.0,
        effectDuration: 2,
      },
      skill2: {
        id: 'tt_s2',
        name: 'Băng Hàn Kiếm Vũ',
        type: 'SKILL_2',
        icon: '❄️',
        spCost: 3,
        rageCost: 0,
        rageGain: 15,
        cooldown: 3,
        targetScope: 'COLUMN_ENEMIES',
        targetDescription: 'Toàn cột dọc địch',
        desc: 'Mưa kiếm băng giá gây 175% sát thương và giảm 30% Tốc Độ địch trong 2 lượt.',
        multiplier: 1.75,
        effectType: 'FREEZE',
        effectChance: 0.5,
        effectDuration: 1,
      },
      ultimate: {
        id: 'tt_ult',
        name: 'Thiên Hạ Kiêu Hùng Trảm',
        type: 'ULTIMATE',
        icon: '⚔️',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ENEMIES',
        targetDescription: 'Toàn bộ kẻ địch',
        desc: 'Tung tuyệt kiếm bá vương gây 260% sát thương Băng lên toàn quân địch và giảm 40% Giáp!',
        multiplier: 2.6,
        effectType: 'DEF_DOWN',
        effectChance: 1.0,
        effectDuration: 2,
        cutinType: 'BANG_ICE',
      },
    },
  },

  hero_ton_quyen: {
    id: 'hero_ton_quyen',
    name: 'Tôn Quyền',
    title: 'Giang Đông Tiểu Bá Vương',
    element: 'Bang',
    role: 'SUPPORT',
    rarity: 'SR',
    cardImage: 'hero_ton_quyen_card',
    baseHp: 1900,
    baseAtk: 430,
    baseDef: 240,
    baseSpeed: 31,
    critRate: 0.18,
    quote: 'Giữ vững Giang Đông, mở rộng cơ nghiệp ngàn thu!',
    spriteActions: {
      IDLE: 'hero_ton_quyen_sprite_idle',
      ATTACK: 'hero_ton_quyen_sprite_sword_attack',
      HURT: 'hero_ton_quyen_sprite_hurt',
      DEATH: 'hero_ton_quyen_sprite_death',
    },
    skills: {
      basic: {
        id: 'tq_basic',
        name: 'Thủy Kiếm Phách',
        type: 'BASIC',
        icon: '🌊',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Chém thủy kiếm gây 105% sát thương và nạp +25 Nộ.',
        multiplier: 1.05,
      },
      skill1: {
        id: 'tq_s1',
        name: 'Giang Đông Hổ Khiếu',
        type: 'SKILL_1',
        icon: '🐯',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 2,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch chỉ định',
        desc: 'Thủy triều băng giá phong ấn kẻ địch, Đóng Băng 1 lượt và gây 180% sát thương.',
        multiplier: 1.8,
        effectType: 'FREEZE',
        effectChance: 0.8,
        effectDuration: 1,
      },
      skill2: {
        id: 'tq_s2',
        name: 'Thủy Trận Hộ Thân',
        type: 'SKILL_2',
        icon: '🛡️',
        spCost: 2,
        rageCost: 0,
        rageGain: 15,
        cooldown: 3,
        targetScope: 'ALL_ALLIES',
        targetDescription: 'Toàn đội minh',
        desc: 'Dâng thủy thuẫn giảm 20% sát thương gánh chịu cho toàn đội trong 2 lượt.',
        multiplier: 0,
        shieldMultiplier: 0.15,
        effectType: 'SHIELD',
        effectChance: 1.0,
        effectDuration: 2,
      },
      ultimate: {
        id: 'tq_ult',
        name: 'Hải Ba Cuồng Nộ',
        type: 'ULTIMATE',
        icon: '🌊',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ENEMIES',
        targetDescription: 'Toàn bộ kẻ địch',
        desc: 'Sóng thần Giang Đông cuốn phăng toàn bộ kẻ địch gây 240% sát thương và làm chậm 30%!',
        multiplier: 2.4,
        cutinType: 'BANG_ICE',
      },
    },
  },

  boss_lu_bo: {
    id: 'boss_lu_bo',
    name: 'Lữ Bố',
    title: 'Vô Song Chiến Thần',
    element: 'Loi',
    role: 'DPS',
    rarity: 'UR',
    cardImage: 'boss_lu_bo_card',
    baseHp: 2800,
    baseAtk: 680,
    baseDef: 290,
    baseSpeed: 37,
    critRate: 0.40,
    quote: 'Ai dám cản bước Lữ Phụng Tiên ta?!',
    spriteActions: {
      IDLE: 'boss_lu_bo_sprite_idle',
      ATTACK: 'boss_lu_bo_sprite_sword_attack',
      HURT: 'boss_lu_bo_sprite_hurt',
      DEATH: 'boss_lu_bo_sprite_death',
    },
    skills: {
      basic: {
        id: 'lb_boss_basic',
        name: 'Phương Thiên Họa Kích Trảm',
        type: 'BASIC',
        icon: '🔱',
        spCost: 0,
        rageCost: 0,
        rageGain: 25,
        cooldown: 0,
        targetScope: 'SINGLE_ENEMY',
        targetDescription: '1 Kẻ địch',
        desc: 'Xoay họa kích cuồng sát gây 130% sát thương Lôi và nạp +25 Nộ.',
        multiplier: 1.3,
      },
      skill1: {
        id: 'lb_boss_s1',
        name: 'Quỷ Thần Đột Kích',
        type: 'SKILL_1',
        icon: '⚡',
        spCost: 2,
        rageCost: 0,
        rageGain: 20,
        cooldown: 2,
        targetScope: 'ROW_ENEMIES',
        targetDescription: 'Toàn hàng ngang địch',
        desc: 'Càn quét hàng ngang gây 200% sát thương Lôi cực đại, phá vỡ mọi hộ thuẫn!',
        multiplier: 2.0,
        effectType: 'DEF_DOWN',
        effectChance: 0.9,
        effectDuration: 2,
      },
      skill2: {
        id: 'lb_boss_s2',
        name: 'Xích Thố Cuồng Phong',
        type: 'SKILL_2',
        icon: '🐎',
        spCost: 2,
        rageCost: 0,
        rageGain: 20,
        cooldown: 3,
        targetScope: 'ALL_ENEMIES',
        targetDescription: 'Toàn bộ kẻ địch',
        desc: 'Ngựa Xích Thố xông trận gây 180% sát thương Lôi lên toàn quân và tăng 50% Công bản thân.',
        multiplier: 1.8,
        effectType: 'ATK_BUFF',
        effectChance: 1.0,
        effectDuration: 2,
      },
      ultimate: {
        id: 'lb_boss_ult',
        name: 'Vô Song Phá Thiên Họa Kích',
        type: 'ULTIMATE',
        icon: '🌩️',
        spCost: 0,
        rageCost: 100,
        rageGain: 0,
        cooldown: 0,
        targetScope: 'ALL_ENEMIES',
        targetDescription: 'Toàn bộ kẻ địch',
        desc: 'Hóa ma thần xoay kích sấm sét hủy diệt toàn bộ quân địch gây 360% sát thương Bạo Kích tàn sát!',
        multiplier: 3.6,
        cutinType: 'LOI_THUNDER',
      },
    },
  },
};

export interface StageDefinition {
  id: number;
  name: string;
  chapter: string;
  recommendedPower: number;
  bgKey: string;
  bgmKey: string;
  staminaCost: number;
  goldReward: number;
  expReward: number;
  diamondReward: number;
  ticketChance: number;
  enemies: {
    id: string;
    slot: number; // 0..4
    name: string;
    heroDefId?: string;
    type: 'soldier' | 'mage' | 'boss';
    element: ElementType;
    hp: number;
    atk: number;
    def: number;
    speed: number;
    spriteKey: string;
  }[];
}

export const CAMPAIGN_STAGES: StageDefinition[] = [
  {
    id: 1,
    name: 'Ải 1: Tiễu Trừ Khởi Nghĩa Hoàng Cân (5v5)',
    chapter: 'Chương 1: Loạn Lạc Khởi Đầu',
    recommendedPower: 2000,
    bgKey: 'bg_main_palace',
    bgmKey: 'assets/audio/bgm_battle_epic.mp3',
    staminaCost: 5,
    goldReward: 800,
    expReward: 200,
    diamondReward: 100,
    ticketChance: 0.5,
    enemies: [
      { id: 'e1_0', slot: 0, name: 'Hoàng Cân Tiên Phong', type: 'soldier', element: 'Phong', hp: 1200, atk: 150, def: 60, speed: 25, spriteKey: 'enemy_soldier' },
      { id: 'e1_1', slot: 1, name: 'Hoàng Cân Giáp Sĩ', type: 'soldier', element: 'Hoa', hp: 1400, atk: 140, def: 80, speed: 22, spriteKey: 'enemy_soldier' },
      { id: 'e1_2', slot: 2, name: 'Hoàng Cân Thuật Sĩ', type: 'mage', element: 'Loi', hp: 950, atk: 180, def: 40, speed: 27, spriteKey: 'enemy_mage' },
      { id: 'e1_3', slot: 3, name: 'Trương Man Thành (Đội Trưởng)', type: 'soldier', element: 'Bang', hp: 1800, atk: 190, def: 90, speed: 29, spriteKey: 'enemy_soldier' },
      { id: 'e1_4', slot: 4, name: 'Hoàng Cân Vu Sư', type: 'mage', element: 'Nguyet', hp: 1000, atk: 170, def: 50, speed: 26, spriteKey: 'enemy_mage' },
    ],
  },
  {
    id: 2,
    name: 'Ải 2: Đột Kích Tiên Phong Doanh Lạc Dương (5v5)',
    chapter: 'Chương 1: Loạn Lạc Khởi Đầu',
    recommendedPower: 3800,
    bgKey: 'bg_battle_chibi',
    bgmKey: 'assets/audio/bgm_battle_epic.mp3',
    staminaCost: 8,
    goldReward: 1500,
    expReward: 400,
    diamondReward: 150,
    ticketChance: 0.7,
    enemies: [
      { id: 'e2_0', slot: 0, name: 'Tây Lương Kỵ Binh', type: 'soldier', element: 'Hoa', hp: 2200, atk: 260, def: 110, speed: 28, spriteKey: 'enemy_soldier' },
      { id: 'e2_1', slot: 1, name: 'Thiết Giáp Vệ Sĩ', type: 'soldier', element: 'Bang', hp: 2600, atk: 220, def: 140, speed: 24, spriteKey: 'enemy_soldier' },
      { id: 'e2_2', slot: 2, name: 'Hỏa Diễm Pháp Sư', type: 'mage', element: 'Hoa', hp: 1800, atk: 320, def: 80, speed: 30, spriteKey: 'enemy_mage' },
      { id: 'e2_3', slot: 3, name: 'Hoa Hùng Tiên Phong (Tướng)', type: 'soldier', element: 'Phong', hp: 3500, atk: 330, def: 150, speed: 31, spriteKey: 'enemy_soldier' },
      { id: 'e2_4', slot: 4, name: 'Lôi Điện Thuật Sĩ', type: 'mage', element: 'Loi', hp: 1900, atk: 310, def: 75, speed: 29, spriteKey: 'enemy_mage' },
    ],
  },
  {
    id: 3,
    name: 'Ải 3: Huyết Chiến Hổ Lao Quan - Boss Lữ Bố (5v5)',
    chapter: 'Chương 2: Tam Anh Chiến Lữ Bố',
    recommendedPower: 6500,
    bgKey: 'bg_battle_hulao',
    bgmKey: 'assets/audio/bgm_battle_epic.mp3',
    staminaCost: 10,
    goldReward: 3000,
    expReward: 800,
    diamondReward: 300,
    ticketChance: 1.0,
    enemies: [
      { id: 'e3_0', slot: 0, name: 'Tây Lương Hộ Vệ Tả', type: 'soldier', element: 'Phong', hp: 3500, atk: 360, def: 160, speed: 30, spriteKey: 'enemy_soldier' },
      { id: 'e3_1', slot: 1, name: 'Tây Lương Hộ Vệ Hữu', type: 'soldier', element: 'Bang', hp: 3800, atk: 340, def: 180, speed: 27, spriteKey: 'enemy_soldier' },
      { id: 'boss_lu_bo_e', slot: 2, name: 'Chiến Thần Lữ Bố (Boss)', heroDefId: 'boss_lu_bo', type: 'boss', element: 'Loi', hp: 10500, atk: 580, def: 270, speed: 37, spriteKey: 'boss_lu_bo' },
      { id: 'e3_3', slot: 3, name: 'Tây Lương Đại Vu Sư', type: 'mage', element: 'Hoa', hp: 2800, atk: 420, def: 110, speed: 32, spriteKey: 'enemy_mage' },
      { id: 'e3_4', slot: 4, name: 'Hắc Ám Thuật Tôn', type: 'mage', element: 'Nguyet', hp: 2700, atk: 410, def: 100, speed: 31, spriteKey: 'enemy_mage' },
    ],
  },
  {
    id: 4,
    name: 'Ải 4: Giang Đông Tranh Bá - Đại Chiến Thủy Quân (5v5)',
    chapter: 'Chương 3: Phân Tranh Quần Hùng',
    recommendedPower: 9000,
    bgKey: 'bg_battle_chibi',
    bgmKey: 'assets/audio/bgm_battle_epic.mp3',
    staminaCost: 12,
    goldReward: 4500,
    expReward: 1200,
    diamondReward: 400,
    ticketChance: 1.0,
    enemies: [
      { id: 'e4_0', slot: 0, name: 'Đô Đốc Tiên Phong', type: 'soldier', element: 'Bang', hp: 5200, atk: 460, def: 220, speed: 31, spriteKey: 'enemy_soldier' },
      { id: 'e4_1', slot: 1, name: 'Chiến Hạm Cận Vệ', type: 'soldier', element: 'Hoa', hp: 5600, atk: 440, def: 250, speed: 28, spriteKey: 'enemy_soldier' },
      { id: 'e4_2', slot: 2, name: 'Đại Thuật Sĩ Thủy Tộc', type: 'mage', element: 'Bang', hp: 4400, atk: 540, def: 160, speed: 34, spriteKey: 'enemy_mage' },
      { id: 'e4_3', slot: 3, name: 'Giang Đông Thống Soái', type: 'soldier', element: 'Phong', hp: 6800, atk: 490, def: 240, speed: 33, spriteKey: 'enemy_soldier' },
      { id: 'e4_4', slot: 4, name: 'Bão Tố Vu Sư', type: 'mage', element: 'Loi', hp: 4200, atk: 560, def: 150, speed: 32, spriteKey: 'enemy_mage' },
    ],
  },
  {
    id: 5,
    name: 'Ải 5: Đại Hỏa Xích Bích Rực Lửa (5v5)',
    chapter: 'Chương 3: Phân Tranh Quần Hùng',
    recommendedPower: 12500,
    bgKey: 'bg_battle_chibi',
    bgmKey: 'assets/audio/bgm_battle_epic.mp3',
    staminaCost: 15,
    goldReward: 6500,
    expReward: 1800,
    diamondReward: 500,
    ticketChance: 1.0,
    enemies: [
      { id: 'e5_0', slot: 0, name: 'Hổ Báo Kỵ Thống Lĩnh', type: 'soldier', element: 'Hoa', hp: 7500, atk: 620, def: 290, speed: 33, spriteKey: 'enemy_soldier' },
      { id: 'e5_1', slot: 1, name: 'Thiết Huyết Hộ Vệ', type: 'soldier', element: 'Loi', hp: 8200, atk: 580, def: 320, speed: 29, spriteKey: 'enemy_soldier' },
      { id: 'e5_2', slot: 2, name: 'Hỏa Ma Đại Pháp Sư', type: 'mage', element: 'Hoa', hp: 6200, atk: 720, def: 200, speed: 36, spriteKey: 'enemy_mage' },
      { id: 'e5_3', slot: 3, name: 'Cận Vệ Hổ Tướng', type: 'soldier', element: 'Phong', hp: 8600, atk: 640, def: 310, speed: 34, spriteKey: 'enemy_soldier' },
      { id: 'e5_4', slot: 4, name: 'Diệt Thế Vu Tôn', type: 'mage', element: 'Nguyet', hp: 6500, atk: 700, def: 210, speed: 35, spriteKey: 'enemy_mage' },
    ],
  },
  {
    id: 6,
    name: 'Ải 6: Đỉnh Cao Tam Quốc - Ma Thần Lữ Bố Chung Cực (5v5)',
    chapter: 'Chương 4: Thống Nhất Thiên Hạ',
    recommendedPower: 16000,
    bgKey: 'bg_battle_hulao',
    bgmKey: 'assets/audio/bgm_battle_epic.mp3',
    staminaCost: 20,
    goldReward: 12000,
    expReward: 4000,
    diamondReward: 1000,
    ticketChance: 1.0,
    enemies: [
      { id: 'e6_0', slot: 0, name: 'Ma Thần Hộ Pháp Tả', type: 'soldier', element: 'Phong', hp: 9500, atk: 740, def: 340, speed: 35, spriteKey: 'enemy_soldier' },
      { id: 'e6_1', slot: 1, name: 'Ma Thần Hộ Pháp Hữu', type: 'soldier', element: 'Bang', hp: 10500, atk: 710, def: 380, speed: 32, spriteKey: 'enemy_soldier' },
      { id: 'boss_lu_bo_final', slot: 2, name: 'Ma Hóa Vô Song Lữ Bố (Chung Cực Boss)', heroDefId: 'boss_lu_bo', type: 'boss', element: 'Loi', hp: 23000, atk: 920, def: 420, speed: 39, spriteKey: 'boss_lu_bo' },
      { id: 'e6_3', slot: 3, name: 'Ma Đạo Tôn Giả', type: 'mage', element: 'Hoa', hp: 8800, atk: 820, def: 260, speed: 36, spriteKey: 'enemy_mage' },
      { id: 'e6_4', slot: 4, name: 'Thần Bí Âm Dương Sư', type: 'mage', element: 'Nguyet', hp: 8600, atk: 800, def: 250, speed: 37, spriteKey: 'enemy_mage' },
    ],
  },
];

/**
 * Elemental Counter table:
 * Phong (Wind) > Loi (Thunder) > Bang (Ice) > Hoa (Fire) > Phong (Wind)
 * Nguyet (Moon) deals 125% to all elements and takes normal damage
 */
export function getElementalMultiplier(attacker: ElementType, defender: ElementType): number {
  if (attacker === 'Nguyet') return 1.25;
  if (defender === 'Nguyet') return 0.95;

  const ADVANTAGE_MAP: Record<ElementType, ElementType> = {
    Phong: 'Loi',
    Loi: 'Bang',
    Bang: 'Hoa',
    Hoa: 'Phong',
    Nguyet: 'Nguyet',
  };

  if (ADVANTAGE_MAP[attacker] === defender) return 1.5;
  if (ADVANTAGE_MAP[defender] === attacker) return 0.75;
  return 1.0;
}

export const ELEMENT_INFO: Record<ElementType, {name: string; icon: string; color: string; badgeBg: string; text: string}> = {
  Phong: { name: 'Phong', icon: '🌪️', color: '#10b981', badgeBg: 'bg-emerald-950/90 border-emerald-500', text: 'text-emerald-400' },
  Hoa: { name: 'Hỏa', icon: '🔥', color: '#ef4444', badgeBg: 'bg-red-950/90 border-red-500', text: 'text-red-400' },
  Bang: { name: 'Băng', icon: '❄️', color: '#38bdf8', badgeBg: 'bg-sky-950/90 border-sky-500', text: 'text-sky-400' },
  Loi: { name: 'Lôi', icon: '⚡', color: '#a855f7', badgeBg: 'bg-purple-950/90 border-purple-500', text: 'text-purple-400' },
  Nguyet: { name: 'Nguyệt', icon: '🌙', color: '#fbbf24', badgeBg: 'bg-amber-950/90 border-amber-400', text: 'text-amber-300' },
};

export const RARITY_INFO: Record<HeroRarity, {name: string; border: string; glow: string; text: string; bg: string}> = {
  UR: { name: 'UR', border: 'border-rose-500 shadow-rose-500/50', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.7)]', text: 'text-rose-400 font-extrabold', bg: 'bg-gradient-to-t from-rose-950/90 to-purple-900/60' },
  SSR: { name: 'SSR', border: 'border-amber-400 shadow-amber-400/50', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.6)]', text: 'text-amber-400 font-bold', bg: 'bg-gradient-to-t from-amber-950/90 to-yellow-900/60' },
  SR: { name: 'SR', border: 'border-purple-400 shadow-purple-400/40', glow: 'shadow-[0_0_10px_rgba(192,132,252,0.5)]', text: 'text-purple-300 font-bold', bg: 'bg-gradient-to-t from-purple-950/90 to-indigo-900/60' },
  R: { name: 'R', border: 'border-blue-400 shadow-blue-400/30', glow: 'shadow-[0_0_8px_rgba(96,165,250,0.4)]', text: 'text-blue-300 font-semibold', bg: 'bg-gradient-to-t from-blue-950/90 to-slate-900/60' },
};

export const CONFIG = {
  title: {
    value: 'Tam Quốc Huyễn Tướng 5v5',
    type: 'string',
    label: 'Tên Game',
    group: 'GAME',
  },
  baseCanvasWidth: {
    value: 1376,
    type: 'number',
    label: 'Chiều Rộng Canvas',
    group: 'GAME',
  },
  baseCanvasHeight: {
    value: 768,
    type: 'number',
    label: 'Chiều Cao Canvas',
    group: 'GAME',
  },
  targetFPS: {
    value: 60,
    type: 'number',
    label: 'Target FPS',
    group: 'SYSTEM',
  },
  stepMs: {
    value: 1000 / 60,
    type: 'number',
    label: 'Step MS',
    group: 'SYSTEM',
  },
  maxSubSteps: {
    value: 5,
    type: 'number',
    label: 'Max Sub Steps',
    group: 'SYSTEM',
  },
  startingGold: {
    value: 5000,
    type: 'number',
    label: 'Vàng Khởi Đầu',
    group: 'Rules',
  },
  startingDiamonds: {
    value: 3000,
    type: 'number',
    label: 'Kim Cương Khởi Đầu',
    group: 'Rules',
  },
  startingSummonTickets: {
    value: 10,
    type: 'number',
    label: 'Vé Triệu Hồi Khởi Đầu',
    group: 'Rules',
  },
  maxStamina: {
    value: 120,
    type: 'number',
    label: 'Thể Lực Tối Đa',
    group: 'Rules',
  },
};

const {playgroundConfig} = globalThis as {
  playgroundConfig?: Record<string, unknown>;
};
if (playgroundConfig) {
  for (const [key, value] of Object.entries(playgroundConfig)) {
    if (key in CONFIG) {
      Object.assign(CONFIG[key as keyof typeof CONFIG], {value});
    }
  }
}

export type ConfigKey = keyof typeof CONFIG;

export function getConfig<K extends ConfigKey>(
  key: K,
): (typeof CONFIG)[K]['value'] {
  return CONFIG[key].value;
}
