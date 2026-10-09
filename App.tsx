// tslint:disable
/* eslint-disable */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Play,
  RotateCw,
  Pause,
  Volume2,
  VolumeX,
  Shield,
  Zap,
  Star,
  Sparkles,
  Trophy,
  Swords,
  Users,
  Award,
  Flame,
  ChevronRight,
  Plus,
  RefreshCw,
  ArrowLeft,
  Settings,
  HelpCircle,
  CheckCircle2,
  Lock,
  Gift,
  X,
  Check,
  Eye,
  FastForward,
  Bot,
  UserCheck,
  Activity,
} from 'lucide-react';
import {
  CONFIG,
  getConfig,
  HERO_DEFINITIONS,
  CAMPAIGN_STAGES,
  getElementalMultiplier,
  ELEMENT_INFO,
  RARITY_INFO,
  HeroDefinition,
  StageDefinition,
  ElementType,
  HeroRarity,
  SkillDefinition,
  TargetScope,
  StatusEffectType,
  StatusEffect,
} from './constants';
import {
  SpriteRenderer,
  SpriteActionConfig,
  SpriteAnimationState,
} from './SpriteRenderer';
import BackgroundMusic from './utils/BackgroundMusic';
import {
  createFixedStepper,
  drawBackground,
  formatTime,
  GameState,
  MenuOverlay,
  Overlay,
  prepareCanvas,
  useAssets,
  useAutoFocus,
  useInput,
  useIsMobile,
  gameAudio,
} from './utils/helper';
import {
  usePlayground,
  usePlaygroundGameLifecycle,
  useRpc,
} from './utils/usePlayground';

// --- ASSET MANIFEST ---
const ASSETS_MANIFEST: Record<string, string> = {
  // Backgrounds
  bg_main_palace: 'assets/images/bg_main_palace.png',
  bg_battle_chibi: 'assets/images/bg_battle_chibi.png',
  bg_battle_hulao: 'assets/images/bg_battle_hulao.png',
  bg_gacha_altar: 'assets/images/bg_gacha_altar.png',

  // Hero Cards
  hero_quan_vu_card: 'assets/images/hero_quan_vu_card.png',
  hero_gia_cat_luong_card: 'assets/images/hero_gia_cat_luong_card.png',
  hero_trieu_van_card: 'assets/images/hero_trieu_van_card.png',
  hero_tao_thao_card: 'assets/images/hero_tao_thao_card.png',
  hero_ton_quyen_card: 'assets/images/hero_ton_quyen_card.png',
  hero_dieu_thuyen_card: 'assets/images/hero_dieu_thuyen_card.png',
  hero_luu_bi_card: 'assets/images/hero_luu_bi_card.png',
  hero_truong_phi_card: 'assets/images/hero_truong_phi_card.png',
  boss_lu_bo_card: 'assets/images/boss_lu_bo_card.png',

  // Icons
  icon_diamond: 'assets/images/icon_diamond.png',
  icon_gold: 'assets/images/icon_gold.png',
  icon_stamina_bun: 'assets/images/icon_stamina_bun.png',
  icon_summon_ticket: 'assets/images/icon_summon_ticket.png',

  // Spritesheets
  hero_quan_vu_sprite_idle: 'assets/images/hero_quan_vu_sprite_idle.png',
  hero_quan_vu_sprite_sword_attack: 'assets/images/hero_quan_vu_sprite_sword_attack.png',
  hero_quan_vu_sprite_hurt: 'assets/images/hero_quan_vu_sprite_hurt.png',
  hero_quan_vu_sprite_death: 'assets/images/hero_quan_vu_sprite_death.png',

  hero_gia_cat_luong_sprite_idle: 'assets/images/hero_gia_cat_luong_sprite_idle.png',
  hero_gia_cat_luong_sprite_shoot: 'assets/images/hero_gia_cat_luong_sprite_shoot.png',
  hero_gia_cat_luong_sprite_hurt: 'assets/images/hero_gia_cat_luong_sprite_hurt.png',
  hero_gia_cat_luong_sprite_death: 'assets/images/hero_gia_cat_luong_sprite_death.png',

  hero_trieu_van_sprite_idle: 'assets/images/hero_trieu_van_sprite_idle.png',
  hero_trieu_van_sprite_attack: 'assets/images/hero_trieu_van_sprite_attack.png',
  hero_trieu_van_sprite_hurt: 'assets/images/hero_trieu_van_sprite_hurt.png',
  hero_trieu_van_sprite_death: 'assets/images/hero_trieu_van_sprite_death.png',

  hero_tao_thao_sprite_idle: 'assets/images/hero_tao_thao_sprite_idle.png',
  hero_tao_thao_sprite_sword_attack: 'assets/images/hero_tao_thao_sprite_sword_attack.png',
  hero_tao_thao_sprite_hurt: 'assets/images/hero_tao_thao_sprite_hurt.png',
  hero_tao_thao_sprite_death: 'assets/images/hero_tao_thao_sprite_death.png',

  hero_ton_quyen_sprite_idle: 'assets/images/hero_ton_quyen_sprite_idle.png',
  hero_ton_quyen_sprite_sword_attack: 'assets/images/hero_ton_quyen_sprite_sword_attack.png',
  hero_ton_quyen_sprite_hurt: 'assets/images/hero_ton_quyen_sprite_hurt.png',
  hero_ton_quyen_sprite_death: 'assets/images/hero_ton_quyen_sprite_death.png',

  hero_dieu_thuyen_sprite_idle: 'assets/images/hero_dieu_thuyen_sprite_idle.png',
  hero_dieu_thuyen_sprite_attack: 'assets/images/hero_dieu_thuyen_sprite_attack.png',
  hero_dieu_thuyen_sprite_hurt: 'assets/images/hero_dieu_thuyen_sprite_hurt.png',
  hero_dieu_thuyen_sprite_death: 'assets/images/hero_dieu_thuyen_sprite_death.png',

  hero_luu_bi_sprite_idle: 'assets/images/hero_luu_bi_sprite_idle.png',
  hero_luu_bi_sprite_sword_attack: 'assets/images/hero_luu_bi_sprite_sword_attack.png',
  hero_luu_bi_sprite_hurt: 'assets/images/hero_luu_bi_sprite_hurt.png',
  hero_luu_bi_sprite_death: 'assets/images/hero_luu_bi_sprite_death.png',

  hero_truong_phi_sprite_idle: 'assets/images/hero_truong_phi_sprite_idle.png',
  hero_truong_phi_sprite_attack: 'assets/images/hero_truong_phi_sprite_attack.png',
  hero_truong_phi_sprite_hurt: 'assets/images/hero_truong_phi_sprite_hurt.png',
  hero_truong_phi_sprite_death: 'assets/images/hero_truong_phi_sprite_death.png',

  boss_lu_bo_sprite_idle: 'assets/images/boss_lu_bo_sprite_idle.png',
  boss_lu_bo_sprite_attack: 'assets/images/boss_lu_bo_sprite_attack.png',
  boss_lu_bo_sprite_sword_attack: 'assets/images/boss_lu_bo_sprite_sword_attack.png',
  boss_lu_bo_sprite_hurt: 'assets/images/boss_lu_bo_sprite_hurt.png',
  boss_lu_bo_sprite_death: 'assets/images/boss_lu_bo_sprite_death.png',

  enemy_soldier_sprite_idle: 'assets/images/enemy_soldier_sprite_idle.png',
  enemy_soldier_sprite_attack: 'assets/images/enemy_soldier_sprite_attack.png',
  enemy_soldier_sprite_hurt: 'assets/images/enemy_soldier_sprite_hurt.png',
  enemy_soldier_sprite_death: 'assets/images/enemy_soldier_sprite_death.png',

  enemy_mage_sprite_idle: 'assets/images/enemy_mage_sprite_idle.png',
  enemy_mage_sprite_shoot: 'assets/images/enemy_mage_sprite_shoot.png',
  enemy_mage_sprite_hurt: 'assets/images/enemy_mage_sprite_hurt.png',
  enemy_mage_sprite_death: 'assets/images/enemy_mage_sprite_death.png',
};

// --- SPRITE CONFIGURATIONS ---
const SPRITE_CONFIGS: Record<string, Record<string, SpriteActionConfig>> = {
  hero_quan_vu: {
    IDLE: { imageUrl: 'hero_quan_vu_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_quan_vu_sprite_sword_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_quan_vu_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_quan_vu_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  hero_gia_cat_luong: {
    IDLE: { imageUrl: 'hero_gia_cat_luong_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_gia_cat_luong_sprite_shoot', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_gia_cat_luong_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_gia_cat_luong_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  hero_trieu_van: {
    IDLE: { imageUrl: 'hero_trieu_van_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_trieu_van_sprite_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_trieu_van_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_trieu_van_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  hero_tao_thao: {
    IDLE: { imageUrl: 'hero_tao_thao_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_tao_thao_sprite_sword_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_tao_thao_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_tao_thao_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  hero_ton_quyen: {
    IDLE: { imageUrl: 'hero_ton_quyen_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_ton_quyen_sprite_sword_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_ton_quyen_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_ton_quyen_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  hero_dieu_thuyen: {
    IDLE: { imageUrl: 'hero_dieu_thuyen_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_dieu_thuyen_sprite_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_dieu_thuyen_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_dieu_thuyen_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  hero_luu_bi: {
    IDLE: { imageUrl: 'hero_luu_bi_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_luu_bi_sprite_sword_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_luu_bi_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_luu_bi_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  hero_truong_phi: {
    IDLE: { imageUrl: 'hero_truong_phi_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'hero_truong_phi_sprite_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'hero_truong_phi_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'hero_truong_phi_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  boss_lu_bo: {
    IDLE: { imageUrl: 'boss_lu_bo_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'boss_lu_bo_sprite_sword_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'boss_lu_bo_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'boss_lu_bo_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  enemy_soldier: {
    IDLE: { imageUrl: 'enemy_soldier_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'enemy_soldier_sprite_attack', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'enemy_soldier_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'enemy_soldier_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
  enemy_mage: {
    IDLE: { imageUrl: 'enemy_mage_sprite_idle', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 8, loop: true },
    ATTACK: { imageUrl: 'enemy_mage_sprite_shoot', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 16, loop: false },
    HURT: { imageUrl: 'enemy_mage_sprite_hurt', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 12, loop: false },
    DEATH: { imageUrl: 'enemy_mage_sprite_death', frameWidth: 512, frameHeight: 512, totalFrames: 16, fps: 10, loop: false },
  },
};

// 5v5 Fixed Battlefield Positions (Player: Left, Enemy: Right)
// Slots: 0=Hàng Trước Trên, 1=Hàng Trước Dưới, 2=Hàng Sau Trên, 3=Hàng Sau Giữa, 4=Hàng Sau Dưới
const PLAYER_SLOT_POSITIONS = [
  { x: 420, y: 220, row: 'TOP', col: 'FRONT' },
  { x: 420, y: 440, row: 'BOT', col: 'FRONT' },
  { x: 200, y: 150, row: 'TOP', col: 'BACK' },
  { x: 200, y: 330, row: 'MID', col: 'BACK' },
  { x: 200, y: 510, row: 'BOT', col: 'BACK' },
];

const ENEMY_SLOT_POSITIONS = [
  { x: 956, y: 220, row: 'TOP', col: 'FRONT' },
  { x: 956, y: 440, row: 'BOT', col: 'FRONT' },
  { x: 1176, y: 150, row: 'TOP', col: 'BACK' },
  { x: 1176, y: 330, row: 'MID', col: 'BACK' },
  { x: 1176, y: 510, row: 'BOT', col: 'BACK' },
];

// --- COMBAT STATE TYPES ---
interface OwnedHero {
  id: string;
  level: number;
  stars: number;
  shards: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  vy: number;
  life: number;
}

interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface VisualEffect {
  id: number;
  type: 'PHONG_DRAGON' | 'HOA_PHOENIX' | 'BANG_ICE' | 'LOI_THUNDER' | 'NGUYET_ILLUSION' | 'SLASH' | 'HEAL_AURA' | 'SHIELD_BURST';
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  life: number;
  maxLife: number;
  radius?: number;
  color?: string;
}

interface UnitStatus {
  type: StatusEffectType;
  name: string;
  duration: number; // turns remaining
  value?: number;
  icon: string;
  color: string;
}

interface CombatHeroUnit {
  uid: string;
  slot: number; // 0..4
  isPlayer: boolean;
  name: string;
  heroDefId?: string;
  spriteKey: string;
  element: ElementType;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  speed: number;
  critRate: number;
  sp: number; // Skill Points (0..10, starts at 4)
  rage: number; // 0..100
  shield: number;
  isDefending: boolean;
  statuses: UnitStatus[];
  cooldowns: Record<string, number>;
  x: number;
  y: number;
  width: number;
  height: number;
  actionState: SpriteAnimationState;
  stateTimer: number;
  cardImageKey?: string;
}

type MainTab = 'LOBBY' | 'CAMPAIGN' | 'ROSTER' | 'TEAM' | 'GACHA' | 'QUESTS';

const STORAGE_KEY = 'tamquoc_huyentuong_5v5_v2';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepperRef = useRef<ReturnType<typeof createFixedStepper>>();
  const isMobile = useIsMobile();

  // --- PLAYGROUND SDK ---
  const {sdk} = usePlayground();

  // --- ASSETS PRELOAD ---
  const {assets, isReady: assetsReady} = useAssets(ASSETS_MANIFEST);

  const canvasWidth = getConfig('baseCanvasWidth') as number;
  const canvasHeight = getConfig('baseCanvasHeight') as number;

  if (!stepperRef.current) {
    const stepMs = getConfig('stepMs');
    const maxSubSteps = getConfig('maxSubSteps');
    stepperRef.current = createFixedStepper(stepMs, maxSubSteps);
  }

  // --- PERSISTENT USER DATA STATE ---
  const [gold, setGold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).gold ?? getConfig('startingGold');
    } catch (_) {}
    return getConfig('startingGold');
  });

  const [diamonds, setDiamonds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).diamonds ?? getConfig('startingDiamonds');
    } catch (_) {}
    return getConfig('startingDiamonds');
  });

  const [tickets, setTickets] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).tickets ?? getConfig('startingSummonTickets');
    } catch (_) {}
    return getConfig('startingSummonTickets');
  });

  const [stamina, setStamina] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).stamina ?? getConfig('maxStamina');
    } catch (_) {}
    return getConfig('maxStamina');
  });

  // Preset 5 Player Heroes: Triệu Vân, Quan Vũ, Trương Phi, Gia Cát Lượng, Điêu Thuyền
  const [ownedHeroes, setOwnedHeroes] = useState<Record<string, OwnedHero>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.includes('ownedHeroes')) {
        return JSON.parse(saved).ownedHeroes;
      }
    } catch (_) {}
    return {
      hero_trieu_van: { id: 'hero_trieu_van', level: 15, stars: 3, shards: 0 },
      hero_quan_vu: { id: 'hero_quan_vu', level: 15, stars: 3, shards: 0 },
      hero_truong_phi: { id: 'hero_truong_phi', level: 14, stars: 3, shards: 0 },
      hero_gia_cat_luong: { id: 'hero_gia_cat_luong', level: 15, stars: 3, shards: 0 },
      hero_dieu_thuyen: { id: 'hero_dieu_thuyen', level: 14, stars: 3, shards: 0 },
      hero_luu_bi: { id: 'hero_luu_bi', level: 10, stars: 2, shards: 0 },
      hero_tao_thao: { id: 'hero_tao_thao', level: 10, stars: 2, shards: 0 },
      hero_ton_quyen: { id: 'hero_ton_quyen', level: 10, stars: 2, shards: 0 },
    };
  });

  // 5 Active team slots
  const [team, setTeam] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.includes('team')) {
        return JSON.parse(saved).team;
      }
    } catch (_) {}
    return ['hero_trieu_van', 'hero_quan_vu', 'hero_truong_phi', 'hero_gia_cat_luong', 'hero_dieu_thuyen'];
  });

  const [clearedStages, setClearedStages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.includes('clearedStages')) {
        return JSON.parse(saved).clearedStages;
      }
    } catch (_) {}
    return [];
  });

  const [pityCounter, setPityCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).pityCounter ?? 0;
    } catch (_) {}
    return 0;
  });

  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).dailyClaimed ?? false;
    } catch (_) {}
    return false;
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      const dataToSave = {
        gold,
        diamonds,
        tickets,
        stamina,
        ownedHeroes,
        team,
        clearedStages,
        pityCounter,
        dailyClaimed,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (_) {}
  }, [gold, diamonds, tickets, stamina, ownedHeroes, team, clearedStages, pityCounter, dailyClaimed]);

  // --- UI NAVIGATION & COMBAT CONTROL STATES ---
  const [currentTab, setCurrentTab] = useState<MainTab>('LOBBY');
  const [selectedHeroId, setSelectedHeroId] = useState<string>('hero_trieu_van');
  const [selectedStage, setSelectedStage] = useState<StageDefinition>(CAMPAIGN_STAGES[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);

  // Combat Toggles
  const [autoBattle, setAutoBattle] = useState<boolean>(false);
  const [battleSpeed, setBattleSpeed] = useState<number>(1);
  const [skipUltimateAnim, setSkipUltimateAnim] = useState<boolean>(false);

  // Turn-Based Interactive Selection States
  const [activeTurnUnitId, setActiveTurnUnitId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  const [selectedTargetUid, setSelectedTargetUid] = useState<string | null>(null);
  const [turnQueueUids, setTurnQueueUids] = useState<string[]>([]);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Ultimate Cut-in Modal State
  const [ultimateHero, setUltimateHero] = useState<HeroDefinition | null>(null);
  const [ultimateCutinVfx, setUltimateCutinVfx] = useState<string | null>(null);
  const ultimateTimeoutRef = useRef<number | null>(null);

  // Gacha Reveal overlay state
  const [gachaResults, setGachaResults] = useState<{hero: HeroDefinition; isNew: boolean}[] | null>(null);

  // Game Lifecycle State for SDK
  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    score: 0,
    level: 1,
  });

  // Combat Units in Ref (5v5 simulation)
  const combatUnitsRef = useRef<CombatHeroUnit[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const particlesRef = useRef<ParticleEffect[]>([]);
  const visualEffectsRef = useRef<VisualEffect[]>([]);
  const screenShakeRef = useRef<number>(0);
  const activeStageRef = useRef<StageDefinition>(CAMPAIGN_STAGES[0]);
  const battleEndProcessedRef = useRef<boolean>(false);
  const combatPhaseRef = useRef<'IDLE' | 'PLAYER_WAIT' | 'ACTION_RUNNING' | 'ENEMY_THINKING'>('IDLE');
  const turnActionTimerRef = useRef<number>(0);

  // Sprite Renderers Cache
  const spriteRenderersRef = useRef<Record<string, SpriteRenderer>>({});
  if (Object.keys(spriteRenderersRef.current).length === 0) {
    Object.entries(SPRITE_CONFIGS).forEach(([key, conf]) => {
      spriteRenderersRef.current[key] = new SpriteRenderer(conf);
    });
  }

  // Calculate combat power of a hero
  const getHeroStats = useCallback((heroId: string) => {
    const base = HERO_DEFINITIONS[heroId];
    if (!base) return { hp: 1200, atk: 250, def: 120, speed: 25, critRate: 0.15, power: 800 };
    const owned = ownedHeroes[heroId] || { level: 1, stars: 1, shards: 0 };
    const lvlMultiplier = 1 + (owned.level - 1) * 0.09;
    const starMultiplier = 1 + (owned.stars - 1) * 0.18;

    const hp = Math.floor(base.baseHp * lvlMultiplier * starMultiplier);
    const atk = Math.floor(base.baseAtk * lvlMultiplier * starMultiplier);
    const def = Math.floor(base.baseDef * lvlMultiplier * starMultiplier);
    const speed = Math.floor(base.baseSpeed + (owned.level - 1) * 0.25);
    const critRate = Math.min(0.8, base.critRate + (owned.stars - 1) * 0.03);
    const power = Math.floor(hp * 0.85 + atk * 3.8 + def * 2.5 + speed * 20);

    return { hp, atk, def, speed, critRate, power };
  }, [ownedHeroes]);

  // Total Team Combat Power
  const teamPower = useMemo(() => {
    return team.reduce((acc, hid) => acc + getHeroStats(hid).power, 0);
  }, [team, getHeroStats]);

  // Level up a hero
  const handleUpgradeHero = (heroId: string) => {
    const owned = ownedHeroes[heroId];
    if (!owned) return;
    const goldCost = owned.level * 350;
    if (gold < goldCost) {
      gameAudio.playErrorBuzz();
      return;
    }
    setGold((prev) => prev - goldCost);
    setOwnedHeroes((prev) => ({
      ...prev,
      [heroId]: { ...owned, level: owned.level + 1 },
    }));
    gameAudio.playLevelUpStinger();
  };

  // Star up a hero
  const handleStarUpHero = (heroId: string) => {
    const owned = ownedHeroes[heroId];
    if (!owned || owned.stars >= 6) return;
    const shardCost = owned.stars * 10;
    if (owned.shards < shardCost) {
      gameAudio.playErrorBuzz();
      return;
    }
    setOwnedHeroes((prev) => ({
      ...prev,
      [heroId]: { ...owned, stars: owned.stars + 1, shards: owned.shards - shardCost },
    }));
    gameAudio.playPowerupChime();
  };

  // Re-calculate Speed-Based Turn Order
  const buildTurnQueue = useCallback(() => {
    const alive = combatUnitsRef.current.filter((u) => u.hp > 0);
    // Sort by effective speed (with speed buff)
    const sorted = [...alive].sort((a, b) => {
      const speedA = a.statuses.some((s) => s.type === 'SPEED_BUFF') ? a.speed * 1.3 : a.speed;
      const speedB = b.statuses.some((s) => s.type === 'SPEED_BUFF') ? b.speed * 1.3 : b.speed;
      if (speedB !== speedA) return speedB - speedA;
      return a.isPlayer ? -1 : 1; // Tie break: player first
    });
    const uids = sorted.map((u) => u.uid);
    setTurnQueueUids(uids);
    return uids;
  }, []);

  // Compute Targets based on Scope
  const getTargetsForScope = useCallback((sourceUnit: CombatHeroUnit, targetUnit: CombatHeroUnit, scope: TargetScope): CombatHeroUnit[] => {
    const allUnits = combatUnitsRef.current;
    const isTargetingEnemy = scope === 'SINGLE_ENEMY' || scope === 'ROW_ENEMIES' || scope === 'COLUMN_ENEMIES' || scope === 'ALL_ENEMIES';
    const candidateGroup = allUnits.filter((u) => u.hp > 0 && (isTargetingEnemy ? u.isPlayer !== sourceUnit.isPlayer : u.isPlayer === sourceUnit.isPlayer));

    if (scope === 'SELF') return [sourceUnit];
    if (scope === 'SINGLE_ENEMY' || scope === 'SINGLE_ALLY') return [targetUnit];
    if (scope === 'ALL_ENEMIES' || scope === 'ALL_ALLIES') return candidateGroup;

    if (scope === 'ROW_ENEMIES') {
      // Top row: slots 0, 2 / Bot row: slots 1, 4 / Mid: 3
      const targetSlot = targetUnit.slot;
      const isTopRow = targetSlot === 0 || targetSlot === 2;
      const isBotRow = targetSlot === 1 || targetSlot === 4;

      return candidateGroup.filter((u) => {
        if (isTopRow) return u.slot === 0 || u.slot === 2;
        if (isBotRow) return u.slot === 1 || u.slot === 4;
        return u.slot === 3 || u.slot === 0 || u.slot === 1;
      });
    }

    if (scope === 'COLUMN_ENEMIES') {
      // Front col: slots 0, 1 / Back col: slots 2, 3, 4
      const targetSlot = targetUnit.slot;
      const isFront = targetSlot === 0 || targetSlot === 1;
      return candidateGroup.filter((u) => (isFront ? u.slot === 0 || u.slot === 1 : u.slot === 2 || u.slot === 3 || u.slot === 4));
    }

    return [targetUnit];
  }, []);

  // Check valid default target for a skill
  const getDefaultTarget = useCallback((sourceUnit: CombatHeroUnit, scope: TargetScope): CombatHeroUnit | null => {
    const allUnits = combatUnitsRef.current;
    if (scope === 'SELF') return sourceUnit;
    if (scope === 'SINGLE_ALLY' || scope === 'ALL_ALLIES') {
      // Lowest HP ally
      const allies = allUnits.filter((u) => u.isPlayer === sourceUnit.isPlayer && u.hp > 0);
      return allies.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0] || sourceUnit;
    } else {
      // Front row enemy first, or lowest HP enemy
      const enemies = allUnits.filter((u) => u.isPlayer !== sourceUnit.isPlayer && u.hp > 0);
      const frontEnemies = enemies.filter((u) => u.slot === 0 || u.slot === 1);
      if (frontEnemies.length > 0) return frontEnemies[0];
      return enemies[0] || null;
    }
  }, []);

  // Process Status Effect Start/End of Turn
  const processTurnStartStatuses = (unit: CombatHeroUnit) => {
    let canAct = true;

    // Defend stance resets at start of turn
    unit.isDefending = false;

    // Process DoT: Burn & Poison
    const burn = unit.statuses.find((s) => s.type === 'BURN');
    if (burn) {
      const burnDmg = Math.floor(unit.maxHp * 0.08);
      unit.hp = Math.max(0, unit.hp - burnDmg);
      floatingTextsRef.current.push({
        id: Date.now() + Math.random(),
        x: unit.x + unit.width / 2,
        y: unit.y - 10,
        text: `-${burnDmg} THIÊU ĐỐT!`,
        color: '#ef4444',
        size: 20,
        alpha: 1,
        vy: -45,
        life: 1.2,
      });
      gameAudio.playGeneralDamage();
    }

    const poison = unit.statuses.find((s) => s.type === 'POISON');
    if (poison) {
      const poisonDmg = Math.floor(unit.maxHp * 0.06);
      unit.hp = Math.max(0, unit.hp - poisonDmg);
      floatingTextsRef.current.push({
        id: Date.now() + Math.random(),
        x: unit.x + unit.width / 2,
        y: unit.y + 10,
        text: `-${poisonDmg} TRÚNG ĐỘC!`,
        color: '#a855f7',
        size: 20,
        alpha: 1,
        vy: -45,
        life: 1.2,
      });
      gameAudio.playPotionGulp();
    }

    // Check Stun / Freeze
    const stun = unit.statuses.find((s) => s.type === 'STUN');
    const freeze = unit.statuses.find((s) => s.type === 'FREEZE');
    if (stun || freeze) {
      canAct = false;
      const label = stun ? '💫 CHOÁNG (MẤT LƯỢT)!' : '🧊 ĐÓNG BĂNG (MẤT LƯỢT)!';
      floatingTextsRef.current.push({
        id: Date.now() + Math.random(),
        x: unit.x + unit.width / 2,
        y: unit.y - 30,
        text: label,
        color: stun ? '#eab308' : '#38bdf8',
        size: 22,
        alpha: 1,
        vy: -50,
        life: 1.5,
      });
      gameAudio.playErrorBuzz();
    }

    // Decrement statuses duration
    unit.statuses = unit.statuses
      .map((s) => ({ ...s, duration: s.duration - 1 }))
      .filter((s) => s.duration > 0);

    // Decrement skill cooldowns
    Object.keys(unit.cooldowns).forEach((sk) => {
      if (unit.cooldowns[sk] > 0) unit.cooldowns[sk] -= 1;
    });

    // Replenish SP (+1 per turn, max 10)
    unit.sp = Math.min(10, unit.sp + 1);

    return canAct;
  };

  // Next Turn Initiator
  const advanceToNextTurn = useCallback(() => {
    if (gameState.status !== 'PLAYING') return;

    // Check Victory/Defeat first
    const alivePlayers = combatUnitsRef.current.filter((u) => u.isPlayer && u.hp > 0);
    const aliveEnemies = combatUnitsRef.current.filter((u) => !u.isPlayer && u.hp > 0);

    if (aliveEnemies.length === 0) {
      // VICTORY!
      if (!battleEndProcessedRef.current) {
        battleEndProcessedRef.current = true;
        const stage = activeStageRef.current;
        setGold((prev) => prev + stage.goldReward);
        setDiamonds((prev) => prev + stage.diamondReward);
        if (Math.random() < stage.ticketChance) {
          setTickets((prev) => prev + 1);
        }
        if (!clearedStages.includes(stage.id)) {
          setClearedStages((prev) => [...prev, stage.id]);
        }
        setGameState((prev) => ({
          ...prev,
          status: 'VICTORY',
          score: prev.score + stage.goldReward + stage.diamondReward,
        }));
        gameAudio.playVictoryFanfare();
      }
      return;
    }

    if (alivePlayers.length === 0) {
      // GAME OVER!
      if (!battleEndProcessedRef.current) {
        battleEndProcessedRef.current = true;
        setGameState((prev) => ({
          ...prev,
          status: 'GAME_OVER',
        }));
        gameAudio.playDefeatMotif();
      }
      return;
    }

    // Refresh queue if empty
    let currentQueue = turnQueueUids.filter((uid) => {
      const u = combatUnitsRef.current.find((unit) => unit.uid === uid);
      return u && u.hp > 0;
    });

    if (currentQueue.length === 0) {
      setRoundNumber((r) => r + 1);
      currentQueue = buildTurnQueue();
    }

    const nextUid = currentQueue.shift()!;
    setTurnQueueUids([...currentQueue]);

    const activeUnit = combatUnitsRef.current.find((u) => u.uid === nextUid);
    if (!activeUnit || activeUnit.hp <= 0) {
      advanceToNextTurn();
      return;
    }

    setActiveTurnUnitId(activeUnit.uid);

    // Process Status Effects at turn start
    const canAct = processTurnStartStatuses(activeUnit);

    if (!canAct) {
      // Skip turn after short delay
      combatPhaseRef.current = 'ACTION_RUNNING';
      setTimeout(() => {
        advanceToNextTurn();
      }, 700 / battleSpeed);
      return;
    }

    if (activeUnit.isPlayer) {
      if (autoBattle) {
        // AI Auto Turn
        combatPhaseRef.current = 'ENEMY_THINKING';
        setIsAiThinking(true);
        setTimeout(() => {
          executePlayerAutoTurn(activeUnit);
        }, 500 / battleSpeed);
      } else {
        // Wait for player interactive input
        combatPhaseRef.current = 'PLAYER_WAIT';
        setIsAiThinking(false);
        const heroDef = HERO_DEFINITIONS[activeUnit.heroDefId || 'hero_trieu_van'];
        const defaultSkill = heroDef?.skills.basic;
        setSelectedSkill(defaultSkill);
        const defaultTarget = getDefaultTarget(activeUnit, defaultSkill?.targetScope || 'SINGLE_ENEMY');
        setSelectedTargetUid(defaultTarget?.uid || null);
      }
    } else {
      // Enemy AI Turn
      combatPhaseRef.current = 'ENEMY_THINKING';
      setIsAiThinking(true);
      setTimeout(() => {
        executeEnemyAiTurn(activeUnit);
      }, 650 / battleSpeed);
    }
  }, [gameState.status, turnQueueUids, battleSpeed, autoBattle, buildTurnQueue, getDefaultTarget]);

  // Execute an Action (Damage, Heals, Buffs, Visual VFX, Sounds, Animations)
  const executeCombatAction = useCallback((
    sourceUnit: CombatHeroUnit,
    skill: SkillDefinition | 'DEFEND',
    targetUnit: CombatHeroUnit | null
  ) => {
    combatPhaseRef.current = 'ACTION_RUNNING';
    setSelectedSkill(null);
    setSelectedTargetUid(null);

    // 1. DEFEND ACTION
    if (skill === 'DEFEND') {
      sourceUnit.isDefending = true;
      sourceUnit.statuses.push({
        type: 'DEFENDING',
        name: 'Phòng Thủ',
        duration: 1,
        icon: '🛡️',
        color: '#38bdf8',
      });
      floatingTextsRef.current.push({
        id: Date.now(),
        x: sourceUnit.x + sourceUnit.width / 2,
        y: sourceUnit.y - 20,
        text: 'PHÒNG THỦ VỮNG VÀNG (-50% ST)!',
        color: '#38bdf8',
        size: 22,
        alpha: 1,
        vy: -50,
        life: 1.4,
      });
      gameAudio.playShieldBlock();

      setTimeout(() => {
        advanceToNextTurn();
      }, 700 / battleSpeed);
      return;
    }

    // 2. SKILL / ATTACK / ULTIMATE ACTION
    // Spend SP & Rage
    if (skill.spCost > 0) sourceUnit.sp = Math.max(0, sourceUnit.sp - skill.spCost);
    if (skill.rageCost > 0) sourceUnit.rage = 0;
    else if (skill.rageGain > 0) sourceUnit.rage = Math.min(100, sourceUnit.rage + skill.rageGain);

    if (skill.cooldown > 0) {
      sourceUnit.cooldowns[skill.id] = skill.cooldown;
    }

    // Play Attacker Animation
    sourceUnit.actionState = { currentAction: 'ATTACK', currentFrame: 0, timer: 0 };
    sourceUnit.stateTimer = 0.8;

    // Ultimate Cut-in Presentation
    if (skill.type === 'ULTIMATE' && !skipUltimateAnim && sourceUnit.heroDefId) {
      const heroDef = HERO_DEFINITIONS[sourceUnit.heroDefId];
      if (heroDef) {
        setUltimateHero(heroDef);
        setUltimateCutinVfx(skill.cutinType || 'PHONG_DRAGON');
        if (ultimateTimeoutRef.current) clearTimeout(ultimateTimeoutRef.current);
        ultimateTimeoutRef.current = window.setTimeout(() => {
          setUltimateHero(null);
          setUltimateCutinVfx(null);
        }, 1300 / battleSpeed);
      }
    }

    // Screen Shake
    screenShakeRef.current = skill.type === 'ULTIMATE' ? 30 : 12;

    // Resolve Target Scope
    const actualTarget = targetUnit || getDefaultTarget(sourceUnit, skill.targetScope) || sourceUnit;
    const targetList = getTargetsForScope(sourceUnit, actualTarget, skill.targetScope);

    // Trigger Elemental Visual VFX & Sounds
    if (skill.type === 'ULTIMATE') {
      gameAudio.playPowerupChime();
      gameAudio.playChiptuneExplosion();

      // Spawn elemental field particles
      const colorMap: Record<string, string> = {
        PHONG_DRAGON: '#10b981',
        HOA_PHOENIX: '#ef4444',
        BANG_ICE: '#38bdf8',
        LOI_THUNDER: '#a855f7',
        NGUYET_ILLUSION: '#fbbf24',
      };
      const vfxColor = colorMap[skill.cutinType || 'PHONG_DRAGON'] || '#f59e0b';

      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40;
        const speed = 150 + Math.random() * 250;
        particlesRef.current.push({
          x: actualTarget.x + actualTarget.width / 2,
          y: actualTarget.y + actualTarget.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 3 + Math.random() * 5,
          color: vfxColor,
          alpha: 1,
          life: 0.9,
          maxLife: 0.9,
        });
      }

      visualEffectsRef.current.push({
        id: Date.now() + Math.random(),
        type: skill.cutinType || 'PHONG_DRAGON',
        x: actualTarget.x + actualTarget.width / 2,
        y: actualTarget.y + actualTarget.height / 2,
        life: 1.2,
        maxLife: 1.2,
      });
    } else {
      gameAudio.playSwordClash();
      visualEffectsRef.current.push({
        id: Date.now() + Math.random(),
        type: 'SLASH',
        x: actualTarget.x + actualTarget.width / 2,
        y: actualTarget.y + actualTarget.height / 2,
        life: 0.4,
        maxLife: 0.4,
      });
    }

    // Apply Damage / Healing / Shielding / Buffs to Targets
    targetList.forEach((target) => {
      // 1. HEALING
      if (skill.healMultiplier && skill.healMultiplier > 0) {
        const healAmt = Math.floor(target.maxHp * skill.healMultiplier);
        target.hp = Math.min(target.maxHp, target.hp + healAmt);
        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: target.x + target.width / 2,
          y: target.y - 15,
          text: `+${healAmt} HỒI MÁU!`,
          color: '#10b981',
          size: 24,
          alpha: 1,
          vy: -55,
          life: 1.4,
        });
        gameAudio.playPotionGulp();
      }

      // 2. SHIELDING
      if (skill.shieldMultiplier && skill.shieldMultiplier > 0) {
        const shieldAmt = Math.floor(target.maxHp * skill.shieldMultiplier);
        target.shield += shieldAmt;
        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: target.x + target.width / 2,
          y: target.y - 25,
          text: `+${shieldAmt} HỘ THUẪN!`,
          color: '#38bdf8',
          size: 22,
          alpha: 1,
          vy: -50,
          life: 1.3,
        });
        gameAudio.playShieldBlock();
      }

      // 3. DAMAGE CALCULATION
      if (skill.multiplier > 0) {
        const isCrit = Math.random() < sourceUnit.critRate;
        const critMult = isCrit ? 1.6 : 1.0;
        const elemMult = getElementalMultiplier(sourceUnit.element, target.element);
        const atkBuff = sourceUnit.statuses.some((s) => s.type === 'ATK_BUFF') ? 1.35 : 1.0;
        const defDebuff = target.statuses.some((s) => s.type === 'DEF_DOWN') ? 0.7 : 1.0;
        const defendReduction = target.isDefending ? 0.5 : 1.0;

        const effectiveAtk = sourceUnit.atk * atkBuff * skill.multiplier;
        const effectiveDef = target.def * defDebuff;
        const rawDmg = Math.max(30, Math.floor((effectiveAtk - effectiveDef * 0.45) * elemMult * critMult * defendReduction));

        // Absorb by Shield first
        let finalHpDmg = rawDmg;
        if (target.shield > 0) {
          if (target.shield >= rawDmg) {
            target.shield -= rawDmg;
            finalHpDmg = 0;
          } else {
            finalHpDmg = rawDmg - target.shield;
            target.shield = 0;
          }
        }

        target.hp = Math.max(0, target.hp - finalHpDmg);
        target.actionState = { currentAction: 'HURT', currentFrame: 0, timer: 0 };
        target.stateTimer = 0.45;

        // Rage gain on receiving hit (+10)
        target.rage = Math.min(100, target.rage + 10);

        // Floating Damage text
        const isHighAdvantage = elemMult > 1;
        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: target.x + target.width / 2 + (Math.random() - 0.5) * 40,
          y: target.y - 10,
          text: `${isCrit ? '💥 BẠO! ' : ''}${isHighAdvantage ? '⚡ KHẮC CHẾ! ' : ''}-${rawDmg}`,
          color: isCrit ? '#f59e0b' : isHighAdvantage ? '#ef4444' : '#ffffff',
          size: isCrit ? 26 : 20,
          alpha: 1,
          vy: -55,
          life: 1.3,
        });

        // Hit Impact sparks
        for (let p = 0; p < 8; p++) {
          particlesRef.current.push({
            x: target.x + target.width / 2,
            y: target.y + target.height / 2,
            vx: (Math.random() - 0.5) * 160,
            vy: (Math.random() - 0.5) * 160,
            radius: 2 + Math.random() * 3,
            color: isCrit ? '#fbbf24' : '#f87171',
            alpha: 1,
            life: 0.4,
            maxLife: 0.4,
          });
        }
      }

      // 4. STATUS EFFECT APPLICATION
      if (skill.effectType && skill.effectChance && Math.random() < skill.effectChance) {
        const effType = skill.effectType;
        const dur = skill.effectDuration || 2;
        const effInfoMap: Record<StatusEffectType, {name: string; icon: string; color: string}> = {
          STUN: { name: 'Choáng', icon: '💫', color: '#eab308' },
          FREEZE: { name: 'Đóng Băng', icon: '🧊', color: '#38bdf8' },
          BURN: { name: 'Thiêu Đốt', icon: '🔥', color: '#ef4444' },
          POISON: { name: 'Trúng Độc', icon: '☠️', color: '#a855f7' },
          SHIELD: { name: 'Khiên', icon: '🛡️', color: '#38bdf8' },
          ATK_BUFF: { name: 'Tăng Công', icon: '⚔️', color: '#f59e0b' },
          DEF_DOWN: { name: 'Giảm Giáp', icon: '💔', color: '#f43f5e' },
          SPEED_BUFF: { name: 'Tăng Tốc', icon: '⚡', color: '#10b981' },
          DEFENDING: { name: 'Phòng Thủ', icon: '🛡️', color: '#38bdf8' },
        };

        const info = effInfoMap[effType];
        // Remove existing same type status if any, then add fresh
        target.statuses = target.statuses.filter((s) => s.type !== effType);
        target.statuses.push({
          type: effType,
          name: info.name,
          duration: dur,
          icon: info.icon,
          color: info.color,
        });

        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: target.x + target.width / 2,
          y: target.y - 35,
          text: `[${info.icon} ${info.name}] (${dur}L)`,
          color: info.color,
          size: 18,
          alpha: 1,
          vy: -40,
          life: 1.3,
        });
      }
    });

    // Advance to next turn after animation completes
    const actionDuration = skill.type === 'ULTIMATE' ? (skipUltimateAnim ? 900 : 1600) : 850;
    setTimeout(() => {
      advanceToNextTurn();
    }, actionDuration / battleSpeed);
  }, [skipUltimateAnim, battleSpeed, getTargetsForScope, getDefaultTarget, advanceToNextTurn]);

  // AI Logic for Player Auto Mode
  const executePlayerAutoTurn = (unit: CombatHeroUnit) => {
    const heroDef = HERO_DEFINITIONS[unit.heroDefId || ''];
    if (!heroDef) {
      executeCombatAction(unit, 'DEFEND', null);
      return;
    }

    // 1. Check Ultimate if rage == 100
    if (unit.rage >= 100) {
      const ult = heroDef.skills.ultimate;
      const target = getDefaultTarget(unit, ult.targetScope);
      executeCombatAction(unit, ult, target);
      return;
    }

    // 2. Check Skill 2 if off cooldown and have SP
    const s2 = heroDef.skills.skill2;
    if (unit.sp >= s2.spCost && (!unit.cooldowns[s2.id] || unit.cooldowns[s2.id] <= 0)) {
      const target = getDefaultTarget(unit, s2.targetScope);
      executeCombatAction(unit, s2, target);
      return;
    }

    // 3. Check Skill 1
    const s1 = heroDef.skills.skill1;
    if (unit.sp >= s1.spCost && (!unit.cooldowns[s1.id] || unit.cooldowns[s1.id] <= 0)) {
      const target = getDefaultTarget(unit, s1.targetScope);
      executeCombatAction(unit, s1, target);
      return;
    }

    // 4. Basic Attack
    const basic = heroDef.skills.basic;
    const target = getDefaultTarget(unit, basic.targetScope);
    executeCombatAction(unit, basic, target);
  };

  // AI Logic for Enemy Boss & Minions
  const executeEnemyAiTurn = (enemyUnit: CombatHeroUnit) => {
    // If enemy is Boss Lu Bo or Hero Def
    if (enemyUnit.heroDefId && HERO_DEFINITIONS[enemyUnit.heroDefId]) {
      const def = HERO_DEFINITIONS[enemyUnit.heroDefId];
      if (enemyUnit.rage >= 100) {
        const ult = def.skills.ultimate;
        const target = getDefaultTarget(enemyUnit, ult.targetScope);
        executeCombatAction(enemyUnit, ult, target);
        return;
      }
      if (enemyUnit.sp >= 2 && Math.random() < 0.6) {
        const skill = Math.random() < 0.5 ? def.skills.skill1 : def.skills.skill2;
        const target = getDefaultTarget(enemyUnit, skill.targetScope);
        executeCombatAction(enemyUnit, skill, target);
        return;
      }
    }

    // Standard Minion AI Attack
    const basicSkill: SkillDefinition = {
      id: 'enemy_atk',
      name: 'Trảm Kích',
      type: 'BASIC',
      icon: '⚔️',
      spCost: 0,
      rageCost: 0,
      rageGain: 25,
      cooldown: 0,
      targetScope: 'SINGLE_ENEMY',
      targetDescription: '1 Tướng',
      desc: 'Tấn công gây 100% sát thương',
      multiplier: 1.0,
    };

    const target = getDefaultTarget(enemyUnit, 'SINGLE_ENEMY');
    executeCombatAction(enemyUnit, basicSkill, target);
  };

  // Setup / Start Combat 5v5
  const startCombat = useCallback((stage: StageDefinition) => {
    if (stamina < stage.staminaCost) {
      gameAudio.playErrorBuzz();
      return;
    }
    setStamina((prev) => Math.max(0, prev - stage.staminaCost));
    activeStageRef.current = stage;
    battleEndProcessedRef.current = false;
    floatingTextsRef.current = [];
    particlesRef.current = [];
    visualEffectsRef.current = [];
    setRoundNumber(1);

    // Initialize 5 player team units
    const playerUnits: CombatHeroUnit[] = team.slice(0, 5).map((heroId, idx) => {
      const def = HERO_DEFINITIONS[heroId] || HERO_DEFINITIONS['hero_trieu_van'];
      const stats = getHeroStats(heroId);
      const pos = PLAYER_SLOT_POSITIONS[idx] || PLAYER_SLOT_POSITIONS[0];

      return {
        uid: `p_${heroId}_${idx}`,
        slot: idx,
        isPlayer: true,
        name: def.name,
        heroDefId: heroId,
        spriteKey: heroId,
        element: def.element,
        maxHp: stats.hp,
        hp: stats.hp,
        atk: stats.atk,
        def: stats.def,
        speed: stats.speed,
        critRate: stats.critRate,
        sp: 4, // Starts with 4 SP
        rage: 25, // Starts with 25 Rage
        shield: 0,
        isDefending: false,
        statuses: [],
        cooldowns: {},
        x: pos.x,
        y: pos.y,
        width: 175,
        height: 175,
        actionState: { currentAction: 'IDLE', currentFrame: 0, timer: 0 },
        stateTimer: 0,
        cardImageKey: def.cardImage,
      };
    });

    // Initialize 5 enemy units
    const enemyUnits: CombatHeroUnit[] = stage.enemies.slice(0, 5).map((e, idx) => {
      const pos = ENEMY_SLOT_POSITIONS[idx] || ENEMY_SLOT_POSITIONS[0];
      const isBoss = e.type === 'boss';

      return {
        uid: `e_${e.id}_${idx}`,
        slot: idx,
        isPlayer: false,
        name: e.name,
        heroDefId: e.heroDefId,
        spriteKey: e.spriteKey,
        element: e.element,
        maxHp: e.hp,
        hp: e.hp,
        atk: e.atk,
        def: e.def,
        speed: e.speed,
        critRate: isBoss ? 0.35 : 0.15,
        sp: 3,
        rage: 0,
        shield: 0,
        isDefending: false,
        statuses: [],
        cooldowns: {},
        x: pos.x,
        y: pos.y,
        width: isBoss ? 230 : 175,
        height: isBoss ? 230 : 175,
        actionState: { currentAction: 'IDLE', currentFrame: 0, timer: 0 },
        stateTimer: 0,
        cardImageKey: e.heroDefId ? HERO_DEFINITIONS[e.heroDefId]?.cardImage : undefined,
      };
    });

    combatUnitsRef.current = [...playerUnits, ...enemyUnits];
    setGameState({
      status: 'PLAYING',
      score: 0,
      level: stage.id,
    });

    if (sdk) sdk.startGame();
    gameAudio.playConfirmSelect();

    // Launch initial turn
    setTimeout(() => {
      buildTurnQueue();
      advanceToNextTurn();
    }, 400);
  }, [stamina, team, getHeroStats, sdk, buildTurnQueue, advanceToNextTurn]);

  // Gacha Summoning Handler
  const handleSummon = (count: 1 | 10) => {
    const costDiamonds = count === 1 ? 300 : 2700;
    const canUseTicket = count === 1 && tickets >= 1;

    if (!canUseTicket && diamonds < costDiamonds) {
      gameAudio.playErrorBuzz();
      return;
    }

    if (canUseTicket) {
      setTickets((prev) => prev - 1);
    } else {
      setDiamonds((prev) => prev - costDiamonds);
    }

    const results: {hero: HeroDefinition; isNew: boolean}[] = [];
    let newPity = pityCounter + count;

    for (let i = 0; i < count; i++) {
      let heroKey = 'hero_trieu_van';
      const rand = Math.random();

      // Pity guarantee UR at 50 pulls
      if (newPity >= 50) {
        const urPool = ['boss_lu_bo', 'hero_quan_vu', 'hero_gia_cat_luong', 'hero_trieu_van'];
        heroKey = urPool[Math.floor(Math.random() * urPool.length)];
        newPity = 0;
      } else if (i === count - 1 && count === 10) {
        // Guaranteed SSR+ on 10x
        const ssrPool = ['hero_trieu_van', 'hero_tao_thao', 'hero_dieu_thuyen', 'hero_quan_vu', 'hero_gia_cat_luong', 'hero_truong_phi'];
        heroKey = ssrPool[Math.floor(Math.random() * ssrPool.length)];
      } else if (rand < 0.05) {
        // UR (5%)
        const urPool = ['boss_lu_bo', 'hero_quan_vu', 'hero_gia_cat_luong', 'hero_trieu_van'];
        heroKey = urPool[Math.floor(Math.random() * urPool.length)];
      } else if (rand < 0.25) {
        // SSR (20%)
        const ssrPool = ['hero_tao_thao', 'hero_dieu_thuyen', 'hero_truong_phi'];
        heroKey = ssrPool[Math.floor(Math.random() * ssrPool.length)];
      } else {
        // SR (75%)
        const srPool = ['hero_luu_bi', 'hero_ton_quyen'];
        heroKey = srPool[Math.floor(Math.random() * srPool.length)];
      }

      const heroDef = HERO_DEFINITIONS[heroKey];
      const isNew = !ownedHeroes[heroKey];
      results.push({ hero: heroDef, isNew });

      setOwnedHeroes((prev) => {
        if (!prev[heroKey]) {
          return {
            ...prev,
            [heroKey]: { id: heroKey, level: 1, stars: 1, shards: 0 },
          };
        } else {
          return {
            ...prev,
            [heroKey]: { ...prev[heroKey], shards: prev[heroKey].shards + 15 },
          };
        }
      });
    }

    setPityCounter(newPity);
    setGachaResults(results);
    gameAudio.playVictoryFanfare();
  };

  // Keyboard Shortcuts (1: Basic, 2: Skill 1, 3: Skill 2, 4: Ult, 5: Defend, Enter: Confirm, Esc: Cancel/Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'PLAYING') return;

      const activeUnit = combatUnitsRef.current.find((u) => u.uid === activeTurnUnitId);
      if (!activeUnit || !activeUnit.isPlayer || combatPhaseRef.current !== 'PLAYER_WAIT') {
        if (e.key === 'Escape') {
          setGameState((prev) => ({
            ...prev,
            status: prev.status === 'PLAYING' ? 'PAUSED' : 'PLAYING',
          }));
        }
        return;
      }

      const heroDef = HERO_DEFINITIONS[activeUnit.heroDefId || ''];
      if (!heroDef) return;

      if (e.key === '1') {
        setSelectedSkill(heroDef.skills.basic);
        const target = getDefaultTarget(activeUnit, heroDef.skills.basic.targetScope);
        setSelectedTargetUid(target?.uid || null);
        gameAudio.playCrispClick();
      } else if (e.key === '2') {
        const s1 = heroDef.skills.skill1;
        if (activeUnit.sp >= s1.spCost && (!activeUnit.cooldowns[s1.id] || activeUnit.cooldowns[s1.id] <= 0)) {
          setSelectedSkill(s1);
          const target = getDefaultTarget(activeUnit, s1.targetScope);
          setSelectedTargetUid(target?.uid || null);
          gameAudio.playCrispClick();
        }
      } else if (e.key === '3') {
        const s2 = heroDef.skills.skill2;
        if (activeUnit.sp >= s2.spCost && (!activeUnit.cooldowns[s2.id] || activeUnit.cooldowns[s2.id] <= 0)) {
          setSelectedSkill(s2);
          const target = getDefaultTarget(activeUnit, s2.targetScope);
          setSelectedTargetUid(target?.uid || null);
          gameAudio.playCrispClick();
        }
      } else if (e.key === '4') {
        const ult = heroDef.skills.ultimate;
        if (activeUnit.rage >= 100) {
          setSelectedSkill(ult);
          const target = getDefaultTarget(activeUnit, ult.targetScope);
          setSelectedTargetUid(target?.uid || null);
          gameAudio.playCrispClick();
        }
      } else if (e.key === '5') {
        executeCombatAction(activeUnit, 'DEFEND', null);
      } else if (e.key === 'Enter') {
        if (selectedSkill && selectedTargetUid) {
          const target = combatUnitsRef.current.find((u) => u.uid === selectedTargetUid);
          executeCombatAction(activeUnit, selectedSkill, target || null);
        }
      } else if (e.key === 'Escape') {
        setSelectedSkill(null);
        setSelectedTargetUid(null);
        gameAudio.playCrispClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, activeTurnUnitId, selectedSkill, selectedTargetUid, getDefaultTarget, executeCombatAction]);

  // --- GAME UPDATE LOOP ---
  const update = (dt: number) => {
    if (gameState.status !== 'PLAYING') return;

    const effectiveDt = dt * battleSpeed;

    // Screen Shake Decay
    if (screenShakeRef.current > 0) {
      screenShakeRef.current = Math.max(0, screenShakeRef.current - dt * 45);
    }

    // Update Floating Texts
    floatingTextsRef.current.forEach((ft) => {
      ft.y += ft.vy * effectiveDt;
      ft.life -= effectiveDt;
      ft.alpha = Math.max(0, ft.life);
    });
    floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.life > 0);

    // Update Particles
    particlesRef.current.forEach((p) => {
      p.x += p.vx * effectiveDt;
      p.y += p.vy * effectiveDt;
      p.life -= effectiveDt;
      p.alpha = Math.max(0, p.life / p.maxLife);
    });
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    // Update Visual Effects
    visualEffectsRef.current.forEach((vfx) => {
      vfx.life -= effectiveDt;
    });
    visualEffectsRef.current = visualEffectsRef.current.filter((vfx) => vfx.life > 0);

    // Update Sprite Animations
    combatUnitsRef.current.forEach((unit) => {
      if (unit.hp <= 0) {
        if (unit.actionState.currentAction !== 'DEATH') {
          unit.actionState = { currentAction: 'DEATH', currentFrame: 0, timer: 0 };
        } else {
          const renderer = spriteRenderersRef.current[unit.spriteKey];
          if (renderer) unit.actionState = renderer.getNextState(unit.actionState, effectiveDt);
        }
        return;
      }

      if (unit.stateTimer > 0) {
        unit.stateTimer -= effectiveDt;
      } else if (unit.actionState.currentAction !== 'IDLE') {
        unit.actionState = { currentAction: 'IDLE', currentFrame: 0, timer: 0 };
      }

      const renderer = spriteRenderersRef.current[unit.spriteKey];
      if (renderer) unit.actionState = renderer.getNextState(unit.actionState, effectiveDt);
    });
  };

  // --- CANVAS DRAW LOOP (5v5 Tactical Battlefield) ---
  const draw = (ctx: CanvasRenderingContext2D) => {
    prepareCanvas(ctx, canvasWidth, canvasHeight);

    ctx.save();
    // Screen Shake
    if (screenShakeRef.current > 0) {
      const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
      const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
      ctx.translate(shakeX, shakeY);
    }

    // Draw Battle Background
    const bgKey = activeStageRef.current.bgKey || 'bg_battle_chibi';
    drawBackground(ctx, assets[bgKey], canvasWidth, canvasHeight, '#0f172a');

    // Draw Center Arena Divider Glow & Stage Floor Marking
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 80);
    ctx.lineTo(canvasWidth / 2, canvasHeight - 60);
    ctx.stroke();
    ctx.restore();

    const units = combatUnitsRef.current;
    const activeUnit = units.find((u) => u.uid === activeTurnUnitId);

    // Determine which units are currently in the target selection area of effect
    let highlightedTargetUids: string[] = [];
    if (selectedSkill && selectedTargetUid && activeUnit) {
      const targetUnit = units.find((u) => u.uid === selectedTargetUid);
      if (targetUnit) {
        const targetList = getTargetsForScope(activeUnit, targetUnit, selectedSkill.targetScope);
        highlightedTargetUids = targetList.map((t) => t.uid);
      }
    }

    // 1. Draw Unit Shadows & Tactical Ground Rings
    units.forEach((unit) => {
      if (unit.hp <= 0 && unit.actionState.currentAction === 'DEATH' && unit.actionState.currentFrame >= 15) return;

      const centerX = unit.x + unit.width / 2;
      const centerY = unit.y + unit.height - 12;
      const isTurnActive = unit.uid === activeTurnUnitId && unit.hp > 0;
      const isTargeted = highlightedTargetUids.includes(unit.uid) && unit.hp > 0;

      ctx.save();
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, unit.width * 0.38, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Active Turn Indicator Ring (Golden pulsating aura)
      if (isTurnActive) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, unit.width * 0.44, 20, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Targeted Selection Ring (Red for enemies, Emerald for allies)
      if (isTargeted) {
        const ringColor = unit.isPlayer ? '#10b981' : '#ef4444';
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 5;
        ctx.shadowColor = ringColor;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, unit.width * 0.48, 22, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Target Reticle marker above head
        ctx.fillStyle = ringColor;
        ctx.font = 'black 22px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▼ TARGET', centerX, unit.y - 48);
      }
      ctx.restore();
    });

    // 2. Draw Units (Sprites)
    units.forEach((unit) => {
      const renderer = spriteRenderersRef.current[unit.spriteKey];
      if (renderer) {
        renderer.draw(
          ctx,
          unit.actionState,
          unit.x,
          unit.y,
          unit.width,
          unit.height,
          assets,
          !unit.isPlayer // Flip enemies to face left
        );
      }

      // Draw Defend Shield Stance Aura
      if (unit.isDefending && unit.hp > 0) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(unit.x + unit.width / 2, unit.y + unit.height / 2, unit.width * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw HP Bar, Rage Bar, SP, Element Badge & Status Icons
      if (unit.hp > 0) {
        const barW = unit.width * 0.85;
        const barH = 7;
        const barX = unit.x + (unit.width - barW) / 2;
        const barY = unit.y - 28;

        // Health Bar BG
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

        // HP Fill
        const hpPercent = Math.max(0, Math.min(1, unit.hp / unit.maxHp));
        ctx.fillStyle = unit.isPlayer ? '#22c55e' : '#ef4444';
        ctx.fillRect(barX, barY, barW * hpPercent, barH);

        // Shield Fill Overlay
        if (unit.shield > 0) {
          const shieldPercent = Math.min(1, unit.shield / unit.maxHp);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(barX, barY, barW * shieldPercent, barH);
        }

        // Rage Bar (Below HP)
        const rageY = barY + barH + 3;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(barX - 2, rageY - 1, barW + 4, 5);
        ctx.fillStyle = unit.rage >= 100 ? '#eab308' : '#f97316';
        ctx.fillRect(barX, rageY, (barW * Math.min(100, unit.rage)) / 100, 3);

        // Name & Element Tag
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        const elemIcon = ELEMENT_INFO[unit.element]?.icon || '⚡';
        ctx.fillText(`${elemIcon} ${unit.name}`, unit.x + unit.width / 2, barY - 7);

        // Status Effect Icons row above unit
        if (unit.statuses.length > 0) {
          const statusText = unit.statuses.map((s) => `${s.icon}${s.duration}`).join(' ');
          ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#fef08a';
          ctx.fillText(statusText, unit.x + unit.width / 2, barY - 22);
        }
      }
    });

    // 4. Draw Cinematic Visual Effects (Elemental Dragons, Phoenix, Lightning, Slashes)
    visualEffectsRef.current.forEach((vfx) => {
      ctx.save();
      const progress = 1 - vfx.life / vfx.maxLife;

      if (vfx.type === 'PHONG_DRAGON') {
        // Swirling Emerald Wind Dragon
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) {
          const r = 30 + a * 25 * progress;
          const px = vfx.x + Math.cos(a + progress * 8) * r;
          const py = vfx.y + Math.sin(a + progress * 8) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else if (vfx.type === 'HOA_PHOENIX') {
        // Fiery Phoenix Blast
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(vfx.x, vfx.y, 140 * progress, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(vfx.x, vfx.y, 90 * progress, 0, Math.PI * 2);
        ctx.stroke();
      } else if (vfx.type === 'BANG_ICE') {
        // Shattering Ice Crystals
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 25;
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8 + progress * 2;
          ctx.beginPath();
          ctx.moveTo(vfx.x, vfx.y);
          ctx.lineTo(vfx.x + Math.cos(angle) * 120 * progress, vfx.y + Math.sin(angle) * 120 * progress);
          ctx.stroke();
        }
      } else if (vfx.type === 'LOI_THUNDER') {
        // Vertical Violent Lightning Bolt
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 10;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.moveTo(vfx.x, 0);
        ctx.lineTo(vfx.x - 30, vfx.y * 0.4);
        ctx.lineTo(vfx.x + 30, vfx.y * 0.7);
        ctx.lineTo(vfx.x, vfx.y);
        ctx.stroke();
      } else if (vfx.type === 'NGUYET_ILLUSION') {
        // Celestial Crescent Aura
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(vfx.x, vfx.y, 110 * progress, 0, Math.PI * 1.5);
        ctx.stroke();
      } else if (vfx.type === 'SLASH') {
        // Sharp sword slash arc
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(vfx.x - 40, vfx.y - 40);
        ctx.lineTo(vfx.x + 40, vfx.y + 40);
        ctx.stroke();
      }
      ctx.restore();
    });

    // 5. Draw Particles
    particlesRef.current.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.1, p.radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 6. Draw Floating Texts
    floatingTextsRef.current.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = `black ${ft.size}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 5;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  };

  // Game Loop Handlers
  const updateRef = useRef(update);
  const drawRef = useRef(draw);
  updateRef.current = update;
  drawRef.current = draw;

  useEffect(() => {
    let raf = 0;
    const loop = (time: number) => {
      stepperRef.current?.(time, (dt) => updateRef.current(dt));
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) drawRef.current(ctx);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // SDK Lifecycle reporting
  usePlaygroundGameLifecycle(gameState, sdk);

  // Auto-start support for headless previews
  const hasAutoplayed = useRef(false);
  useEffect(() => {
    if (!hasAutoplayed.current && new URLSearchParams(window.location.search).has('autoplay')) {
      hasAutoplayed.current = true;
      startCombat(CAMPAIGN_STAGES[0]);
    }
  }, [startCombat]);

  // Dynamic BGM Track selection
  const currentBgmUrl = useMemo(() => {
    if (gameState.status === 'PLAYING') {
      return activeStageRef.current.bgmKey || 'assets/audio/bgm_battle_epic.mp3';
    }
    return 'assets/audio/bgm_palace_theme.mp3';
  }, [gameState.status]);

  const isMusicPlaying = !isMusicMuted && gameState.status !== 'PAUSED';

  // Leader hero for lobby display
  const currentHeroLeader = useMemo(() => {
    const leaderId = team[0] || 'hero_trieu_van';
    return HERO_DEFINITIONS[leaderId] || HERO_DEFINITIONS['hero_trieu_van'];
  }, [team]);

  // Current active unit during player turn
  const activeHeroUnit = useMemo(() => {
    return combatUnitsRef.current.find((u) => u.uid === activeTurnUnitId && u.isPlayer);
  }, [activeTurnUnitId]);

  const activeHeroDef = useMemo(() => {
    if (!activeHeroUnit || !activeHeroUnit.heroDefId) return null;
    return HERO_DEFINITIONS[activeHeroUnit.heroDefId];
  }, [activeHeroUnit]);

  // Canvas battlefield click handler for target selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.status !== 'PLAYING' || combatPhaseRef.current !== 'PLAYER_WAIT') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvasWidth / rect.width);
    const clickY = (e.clientY - rect.top) * (canvasHeight / rect.height);

    // Find clicked unit
    const clickedUnit = combatUnitsRef.current.find((u) => {
      if (u.hp <= 0) return false;
      return clickX >= u.x && clickX <= u.x + u.width && clickY >= u.y && clickY <= u.y + u.height;
    });

    if (clickedUnit) {
      setSelectedTargetUid(clickedUnit.uid);
      gameAudio.playCrispClick();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden touch-none flex flex-col bg-slate-950 text-white font-sans select-none">
      {/* Background Music Player */}
      <BackgroundMusic url={currentBgmUrl} isPlaying={isMusicPlaying} isMuted={isMusicMuted} />

      {/* Loading Overlay */}
      {!assetsReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-amber-400 gap-4">
          <RefreshCw className="animate-spin" size={48} />
          <div className="text-xl font-bold tracking-wider">ĐANG TẢI TÀI NGUYÊN TAM QUỐC 5V5...</div>
        </div>
      )}

      {/* TOP HEADER STATUS BAR (Universal Resources) */}
      <header className="w-full bg-slate-900/95 border-b border-amber-500/30 px-3 py-2 flex flex-wrap items-center justify-between z-30 shrink-0 gap-2 shadow-lg backdrop-blur-md">
        {/* Game Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center shadow-inner">
            <Flame className="text-amber-400" size={18} />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 tracking-wider">
              {getConfig('title') as string}
            </h1>
            <div className="text-[10px] text-amber-200/70">Lực Chiến 5 Tướng: {teamPower.toLocaleString('vi-VN')}</div>
          </div>
        </div>

        {/* Currency Resources */}
        <div className="flex items-center gap-3 text-xs">
          {/* Stamina */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-full">
            <img src={ASSETS_MANIFEST['icon_stamina_bun']} alt="Thể lực" className="w-4 h-4 object-contain" />
            <span className="font-bold text-amber-200">{stamina}/{getConfig('maxStamina') as number}</span>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-full">
            <img src={ASSETS_MANIFEST['icon_gold']} alt="Vàng" className="w-4 h-4 object-contain" />
            <span className="font-bold text-yellow-400">{gold.toLocaleString('vi-VN')}</span>
          </div>

          {/* Diamonds */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-full">
            <img src={ASSETS_MANIFEST['icon_diamond']} alt="Kim cương" className="w-4 h-4 object-contain" />
            <span className="font-bold text-cyan-400">{diamonds.toLocaleString('vi-VN')}</span>
          </div>

          {/* Summon Tickets */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-full">
            <img src={ASSETS_MANIFEST['icon_summon_ticket']} alt="Lệnh triệu hồi" className="w-4 h-4 object-contain" />
            <span className="font-bold text-rose-400">{tickets}</span>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          {gameState.status === 'PLAYING' && (
            <button
              onClick={() => setGameState((prev) => ({ ...prev, status: 'PAUSED' }))}
              className="px-2.5 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500 text-amber-300 flex items-center gap-1 text-xs transition-colors min-h-[36px]"
            >
              <Pause size={14} />
              <span>Tạm Dừng</span>
            </button>
          )}

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Cài Đặt"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 5V5 ACTIVE BATTLEFIELD VIEW (Timeline Bar on Top, 5v5 Canvas, Action Panel) */}
      {/* ========================================================================= */}
      {gameState.status === 'PLAYING' && (
        <div className="flex-1 w-full min-h-0 relative flex flex-col items-center justify-between bg-slate-950 overflow-hidden">
          {/* TOP TIMELINE BAR (Turn Order Initiative Queue) */}
          <div className="w-full bg-slate-900/95 border-b border-slate-800 py-1.5 px-3 flex items-center justify-between z-20 shrink-0 gap-2 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                Hiệp {roundNumber}
              </span>
              <span className="text-[11px] text-slate-300 font-bold hidden md:inline">
                {activeStageRef.current.name}
              </span>
            </div>

            {/* Turn Queue Avatars */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {combatUnitsRef.current
                .filter((u) => u.hp > 0)
                .sort((a, b) => (b.uid === activeTurnUnitId ? 1 : 0) - (a.uid === activeTurnUnitId ? 1 : 0))
                .map((unit) => {
                  const isActive = unit.uid === activeTurnUnitId;
                  const def = unit.heroDefId ? HERO_DEFINITIONS[unit.heroDefId] : null;

                  return (
                    <div
                      key={unit.uid}
                      className={`relative w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'border-amber-400 scale-110 shadow-[0_0_12px_rgba(251,191,36,0.9)] ring-2 ring-yellow-400 z-10'
                          : unit.isPlayer
                          ? 'border-blue-500/60 bg-blue-950/40 opacity-80'
                          : 'border-rose-500/60 bg-rose-950/40 opacity-80'
                      }`}
                    >
                      {def?.cardImage && assets[def.cardImage] ? (
                        <img src={ASSETS_MANIFEST[def.cardImage]} alt={unit.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black">{unit.name.slice(0, 2)}</span>
                      )}

                      {/* Element Badge */}
                      <span className="absolute top-0 right-0 text-[8px] bg-black/80 px-0.5 rounded">
                        {ELEMENT_INFO[unit.element]?.icon || '⚡'}
                      </span>

                      {/* HP Mini Bottom Bar */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 ${unit.isPlayer ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.max(0, (unit.hp / unit.maxHp) * 100)}%` }}
                      />
                    </div>
                  );
                })}
            </div>

            {/* Auto & Speed Control Badges */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAutoBattle((prev) => !prev);
                  gameAudio.playCrispClick();
                }}
                className={`px-2 py-1 rounded text-xs font-bold border transition-colors min-h-[32px] flex items-center gap-1 ${
                  autoBattle
                    ? 'bg-amber-500 text-black border-amber-300 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Bot size={14} />
                <span className="hidden sm:inline">TỰ ĐỘNG</span>
              </button>

              <button
                onClick={() => {
                  setBattleSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
                  gameAudio.playCrispClick();
                }}
                className={`px-2 py-1 rounded text-xs font-black border transition-colors min-h-[32px] ${
                  battleSpeed > 1
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {battleSpeed}X
              </button>

              <button
                onClick={() => {
                  setSkipUltimateAnim((prev) => !prev);
                  gameAudio.playCrispClick();
                }}
                className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors min-h-[32px] ${
                  skipUltimateAnim
                    ? 'bg-rose-600 text-white border-rose-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Bỏ qua Hoạt ảnh Chiêu cuối"
              >
                {skipUltimateAnim ? 'BỎ QUA ULT' : 'XEM ULT'}
              </button>
            </div>
          </div>

          {/* CENTER CANVAS BATTLEFIELD */}
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onClick={handleCanvasClick}
              style={{
                aspectRatio: `${canvasWidth} / ${canvasHeight}`,
                width: `min(100%, calc(100vh * ${canvasWidth} / ${canvasHeight}))`,
              }}
              className="h-auto max-w-full max-h-full shadow-2xl bg-black cursor-crosshair"
            />
          </div>

          {/* BOTTOM TURN-BASED ACTION CONTROL PANEL (On Player Turn) */}
          <div className="w-full bg-slate-900/95 border-t border-amber-500/40 p-2 md:p-3 flex flex-col md:flex-row items-center justify-between z-20 shrink-0 gap-3 backdrop-blur-md">
            {activeHeroUnit && activeHeroDef ? (
              <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-3">
                {/* Active Hero Portrait & Stats */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-14 h-16 md:w-16 md:h-20 rounded-xl border-2 border-amber-400 overflow-hidden bg-black relative shadow-lg">
                    {assets[activeHeroDef.cardImage] && (
                      <img
                        src={ASSETS_MANIFEST[activeHeroDef.cardImage]}
                        alt={activeHeroDef.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-0 left-0 bg-black/80 text-[10px] font-black px-1 rounded text-yellow-300">
                      {activeHeroDef.rarity}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-base font-black text-amber-300">{activeHeroDef.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${ELEMENT_INFO[activeHeroDef.element].badgeBg} ${ELEMENT_INFO[activeHeroDef.element].text}`}>
                        {ELEMENT_INFO[activeHeroDef.element].name}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-3">
                      <span>HP: <strong className="text-emerald-400">{activeHeroUnit.hp} / {activeHeroUnit.maxHp}</strong></span>
                      <span>SP: <strong className="text-cyan-400">{activeHeroUnit.sp} / 10</strong></span>
                      <span>Nộ: <strong className="text-amber-400">{activeHeroUnit.rage}%</strong></span>
                    </div>

                    <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all"
                        style={{ width: `${activeHeroUnit.rage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5 Action Command Buttons */}
                <div className="flex flex-wrap items-center gap-2 justify-center">
                  {/* 1. Đánh Thường (Basic Attack) */}
                  <button
                    disabled={combatPhaseRef.current !== 'PLAYER_WAIT'}
                    onClick={() => {
                      setSelectedSkill(activeHeroDef.skills.basic);
                      const target = getDefaultTarget(activeHeroUnit, activeHeroDef.skills.basic.targetScope);
                      setSelectedTargetUid(target?.uid || null);
                      gameAudio.playCrispClick();
                    }}
                    className={`px-3 py-2 rounded-xl border flex flex-col items-center justify-center min-w-[70px] md:min-w-[85px] min-h-[50px] transition-all ${
                      selectedSkill?.id === activeHeroDef.skills.basic.id
                        ? 'bg-amber-500 text-black border-amber-300 ring-2 ring-amber-400 font-bold shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800/90 text-white border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-sm">⚔️</span>
                    <span className="text-[11px] font-bold">Đánh Thường</span>
                    <span className="text-[9px] text-amber-300 font-semibold">+25 Nộ</span>
                  </button>

                  {/* 2. Kỹ Năng 1 (Active Skill 1) */}
                  {(() => {
                    const s1 = activeHeroDef.skills.skill1;
                    const onCd = activeHeroUnit.cooldowns[s1.id] && activeHeroUnit.cooldowns[s1.id] > 0;
                    const notEnoughSp = activeHeroUnit.sp < s1.spCost;
                    const isDisabled = onCd || notEnoughSp || combatPhaseRef.current !== 'PLAYER_WAIT';

                    return (
                      <button
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedSkill(s1);
                          const target = getDefaultTarget(activeHeroUnit, s1.targetScope);
                          setSelectedTargetUid(target?.uid || null);
                          gameAudio.playCrispClick();
                        }}
                        className={`px-3 py-2 rounded-xl border flex flex-col items-center justify-center min-w-[75px] md:min-w-[95px] min-h-[50px] transition-all ${
                          isDisabled
                            ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                            : selectedSkill?.id === s1.id
                            ? 'bg-cyan-600 text-white border-cyan-300 ring-2 ring-cyan-400 font-bold shadow-lg shadow-cyan-500/30'
                            : 'bg-slate-800/90 text-white border-slate-700 hover:border-cyan-400'
                        }`}
                      >
                        <span className="text-sm">{s1.icon}</span>
                        <span className="text-[11px] font-bold truncate max-w-[85px]">{s1.name}</span>
                        <span className="text-[9px] text-cyan-300 font-semibold">
                          {onCd ? `CD: ${activeHeroUnit.cooldowns[s1.id]}L` : `SP: ${s1.spCost}`}
                        </span>
                      </button>
                    );
                  })()}

                  {/* 3. Kỹ Năng 2 (Active Skill 2) */}
                  {(() => {
                    const s2 = activeHeroDef.skills.skill2;
                    const onCd = activeHeroUnit.cooldowns[s2.id] && activeHeroUnit.cooldowns[s2.id] > 0;
                    const notEnoughSp = activeHeroUnit.sp < s2.spCost;
                    const isDisabled = onCd || notEnoughSp || combatPhaseRef.current !== 'PLAYER_WAIT';

                    return (
                      <button
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedSkill(s2);
                          const target = getDefaultTarget(activeHeroUnit, s2.targetScope);
                          setSelectedTargetUid(target?.uid || null);
                          gameAudio.playCrispClick();
                        }}
                        className={`px-3 py-2 rounded-xl border flex flex-col items-center justify-center min-w-[75px] md:min-w-[95px] min-h-[50px] transition-all ${
                          isDisabled
                            ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                            : selectedSkill?.id === s2.id
                            ? 'bg-purple-600 text-white border-purple-300 ring-2 ring-purple-400 font-bold shadow-lg shadow-purple-500/30'
                            : 'bg-slate-800/90 text-white border-slate-700 hover:border-purple-400'
                        }`}
                      >
                        <span className="text-sm">{s2.icon}</span>
                        <span className="text-[11px] font-bold truncate max-w-[85px]">{s2.name}</span>
                        <span className="text-[9px] text-purple-300 font-semibold">
                          {onCd ? `CD: ${activeHeroUnit.cooldowns[s2.id]}L` : `SP: ${s2.spCost}`}
                        </span>
                      </button>
                    );
                  })()}

                  {/* 4. Tuyệt Kỹ (Ultimate / Chiêu Cuối) */}
                  {(() => {
                    const ult = activeHeroDef.skills.ultimate;
                    const isRageFull = activeHeroUnit.rage >= 100;
                    const isDisabled = !isRageFull || combatPhaseRef.current !== 'PLAYER_WAIT';

                    return (
                      <button
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedSkill(ult);
                          const target = getDefaultTarget(activeHeroUnit, ult.targetScope);
                          setSelectedTargetUid(target?.uid || null);
                          gameAudio.playCrispClick();
                        }}
                        className={`px-3 py-2 rounded-xl border-2 flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px] min-h-[50px] transition-all ${
                          !isRageFull
                            ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                            : selectedSkill?.id === ult.id
                            ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-yellow-300 ring-2 ring-yellow-400 font-black shadow-xl shadow-rose-500/40 animate-pulse'
                            : 'bg-gradient-to-r from-amber-600 to-rose-700 text-white border-amber-400 hover:scale-105 shadow-md shadow-amber-500/30'
                        }`}
                      >
                        <span className="text-sm">{ult.icon}</span>
                        <span className="text-[11px] font-black">⚡ TUYỆT KỸ</span>
                        <span className="text-[9px] text-yellow-200 font-bold">100 NỘ</span>
                      </button>
                    );
                  })()}

                  {/* 5. Phòng Thủ (Defend) */}
                  <button
                    disabled={combatPhaseRef.current !== 'PLAYER_WAIT'}
                    onClick={() => {
                      executeCombatAction(activeHeroUnit, 'DEFEND', null);
                    }}
                    className="px-3 py-2 rounded-xl border border-sky-500/50 bg-sky-950/60 hover:bg-sky-900 text-sky-200 flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] min-h-[50px] transition-all"
                  >
                    <Shield size={16} />
                    <span className="text-[11px] font-bold">Phòng Thủ</span>
                    <span className="text-[9px] text-sky-400">-50% ST</span>
                  </button>
                </div>

                {/* Target Scope & Confirm/Cancel Action Panel */}
                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3 shrink-0">
                  {selectedSkill ? (
                    <div className="flex flex-col gap-1 items-end">
                      <div className="text-[11px] text-slate-300 text-right">
                        Mục tiêu: <strong className="text-amber-400">{selectedSkill.targetDescription}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Cancel Selection */}
                        <button
                          onClick={() => {
                            setSelectedSkill(null);
                            setSelectedTargetUid(null);
                            gameAudio.playCrispClick();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 border border-slate-700 min-h-[36px]"
                        >
                          <X size={14} />
                          HỦY
                        </button>

                        {/* Confirm Execution */}
                        <button
                          onClick={() => {
                            const target = combatUnitsRef.current.find((u) => u.uid === selectedTargetUid);
                            executeCombatAction(activeHeroUnit, selectedSkill, target || null);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs md:text-sm flex items-center gap-1 shadow-lg shadow-amber-500/30 min-h-[36px] hover:scale-105"
                        >
                          <Check size={16} />
                          XÁC NHẬN
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      Chọn kỹ năng & chạm mục tiêu trên chiến trường
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center py-2 text-xs md:text-sm font-bold text-amber-400/90 animate-pulse">
                {isAiThinking ? '🤖 ĐỐI PHƯƠNG ĐANG TÍNH TOÁN NƯỚC ĐI...' : 'ĐANG THỰC HIỆN CHIÊU THỨC...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NON-COMBAT VIEWS (Lobby, Campaign, Roster, Team, Gacha, Quests) */}
      {/* ========================================================================= */}
      {gameState.status !== 'PLAYING' && (
        <div className="flex-1 w-full min-h-0 relative flex flex-col overflow-y-auto touch-auto bg-slate-950">
          {/* TAB 1: LOBBY / SẢNH HOÀNG CUNG */}
          {currentTab === 'LOBBY' && (
            <div className="relative flex-1 min-h-[550px] flex flex-col justify-between p-4 md:p-8 overflow-hidden">
              <img
                src={ASSETS_MANIFEST['bg_main_palace']}
                alt="Hoàng Cung"
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 pointer-events-none" />

              {/* Leader Character Showcase */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto w-full my-auto">
                <div className="max-w-lg space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                    <Sparkles size={14} />
                    Danh Tướng Chủ Soái Đội Hình
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-amber-400 tracking-wide drop-shadow-md">
                    {currentHeroLeader.name}
                  </h2>
                  <div className="text-sm md:text-base font-semibold text-amber-200/90 italic">
                    "{currentHeroLeader.quote}"
                  </div>
                  <div className="space-y-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs md:text-sm text-slate-300">
                    <div>
                      <strong className="text-amber-400">Tuyệt kỹ {currentHeroLeader.skills.ultimate.name}:</strong>
                    </div>
                    <div>{currentHeroLeader.skills.ultimate.desc}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentTab('CAMPAIGN')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-base md:text-lg shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 min-h-[48px]"
                    >
                      <Swords size={20} />
                      VÀO CHIẾN DỊCH 5V5
                    </button>

                    <button
                      onClick={() => setCurrentTab('GACHA')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-base md:text-lg shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 min-h-[48px]"
                    >
                      <Sparkles size={20} />
                      TRIỆU HỒI TƯỚNG
                    </button>
                  </div>
                </div>

                {/* Character Big Bust Card */}
                <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)] bg-gradient-to-t from-slate-900 to-amber-950/50 flex items-center justify-center group">
                  {assets[currentHeroLeader.cardImage] && (
                    <img
                      src={ASSETS_MANIFEST[currentHeroLeader.cardImage]}
                      alt={currentHeroLeader.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-300 font-bold">{currentHeroLeader.title}</div>
                      <div className="text-sm font-black text-white">{currentHeroLeader.name}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-black ${RARITY_INFO[currentHeroLeader.rarity].bg} border ${RARITY_INFO[currentHeroLeader.rarity].border} ${RARITY_INFO[currentHeroLeader.rarity].text}`}>
                      {currentHeroLeader.rarity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPAIGN / CHIẾN DỊCH 5V5 */}
          {currentTab === 'CAMPAIGN' && (
            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Chiến Dịch 5v5 Tam Quốc</h2>
                  <p className="text-xs md:text-sm text-slate-400">5 Tướng xuất trận, khắc chế ngũ hành, phối hợp kỹ năng và tuyệt kỹ bộc phá.</p>
                </div>
                <div className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                  Đã Vượt: {clearedStages.length} / {CAMPAIGN_STAGES.length} Ải
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAMPAIGN_STAGES.map((stage) => {
                  const isCleared = clearedStages.includes(stage.id);
                  const isUnlocked = stage.id === 1 || clearedStages.includes(stage.id - 1);

                  return (
                    <div
                      key={stage.id}
                      className={`relative rounded-2xl border-2 overflow-hidden flex flex-col justify-between p-4 transition-all ${
                        isUnlocked
                          ? 'border-amber-500/40 bg-slate-900/90 hover:border-amber-400 hover:shadow-xl shadow-slate-950'
                          : 'border-slate-800 bg-slate-900/40 opacity-60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {stage.chapter}
                          </span>
                          {isCleared ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                              <CheckCircle2 size={14} /> Hoàn Thành
                            </span>
                          ) : !isUnlocked ? (
                            <span className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                              <Lock size={14} /> Khóa
                            </span>
                          ) : null}
                        </div>

                        <h3 className="text-base font-extrabold text-white">{stage.name}</h3>

                        <div className="text-xs text-slate-300 space-y-1">
                          <div>Lực Chiến Khuyến Nghị: <span className="text-yellow-400 font-bold">{stage.recommendedPower.toLocaleString('vi-VN')}</span></div>
                          <div>Quân Địch (5 Tướng): <span className="text-slate-200">{stage.enemies.map(e => e.name).join(', ')}</span></div>
                        </div>

                        {/* Rewards */}
                        <div className="flex items-center gap-3 pt-2 text-xs border-t border-slate-800">
                          <span className="text-yellow-400 font-bold">+{stage.goldReward} Vàng</span>
                          <span className="text-cyan-400 font-bold">+{stage.diamondReward} Kim Cương</span>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between">
                        <div className="text-xs text-amber-300 font-bold flex items-center gap-1">
                          <img src={ASSETS_MANIFEST['icon_stamina_bun']} alt="Thể lực" className="w-4 h-4 object-contain" />
                          Tiêu hao: {stage.staminaCost}
                        </div>

                        <button
                          disabled={!isUnlocked}
                          onClick={() => startCombat(stage)}
                          className={`px-4 py-2 rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all min-h-[44px] ${
                            isUnlocked
                              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Play size={16} />
                          XUẤT TRẬN (5V5)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ROSTER / DANH TƯỚNG & KỸ NĂNG */}
          {currentTab === 'ROSTER' && (
            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-amber-400">Danh Sách Danh Tướng</h2>
                  <p className="text-xs md:text-sm text-slate-400">Nâng cấp level, tăng sao và kiểm tra toàn bộ 4 bộ kỹ năng chiến đấu.</p>
                </div>
                <div className="text-xs font-bold text-amber-300">
                  Đã Chiêu Mộ: {Object.keys(ownedHeroes).length} / {Object.keys(HERO_DEFINITIONS).length}
                </div>
              </div>

              {/* Grid of Heroes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(HERO_DEFINITIONS).map((heroDef) => {
                  const owned = ownedHeroes[heroDef.id];
                  const isOwned = !!owned;
                  const stats = getHeroStats(heroDef.id);
                  const upgradeCost = owned ? owned.level * 350 : 0;
                  const starCost = owned ? owned.stars * 10 : 0;
                  const canStarUp = owned && owned.shards >= starCost && owned.stars < 6;

                  return (
                    <div
                      key={heroDef.id}
                      className={`relative rounded-2xl border-2 p-4 flex flex-col justify-between gap-3 transition-all ${
                        isOwned
                          ? `${RARITY_INFO[heroDef.rarity].bg} border-amber-500/50 shadow-lg`
                          : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'
                      }`}
                    >
                      {/* Top Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-20 h-24 rounded-xl border border-amber-400/40 overflow-hidden bg-black shrink-0 relative">
                          {assets[heroDef.cardImage] && (
                            <img
                              src={ASSETS_MANIFEST[heroDef.cardImage]}
                              alt={heroDef.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <span className={`absolute top-1 left-1 text-[10px] font-black px-1 rounded ${RARITY_INFO[heroDef.rarity].bg} ${RARITY_INFO[heroDef.rarity].text}`}>
                            {heroDef.rarity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-white truncate">{heroDef.name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ELEMENT_INFO[heroDef.element].badgeBg} ${ELEMENT_INFO[heroDef.element].text}`}>
                              Hệ {ELEMENT_INFO[heroDef.element].name}
                            </span>
                          </div>

                          <div className="text-xs text-amber-200">
                            {isOwned ? `Cấp ${owned.level} • ${'⭐'.repeat(owned.stars)}` : 'Chưa sở hữu'}
                          </div>
                          <div className="text-xs font-bold text-yellow-400">
                            Lực Chiến: {stats.power.toLocaleString('vi-VN')}
                          </div>
                          <div className="text-[11px] text-slate-300">
                            HP: {stats.hp} | Công: {stats.atk} | Thủ: {stats.def} | Tốc: {stats.speed}
                          </div>
                        </div>
                      </div>

                      {/* 4 Skills Showcase */}
                      <div className="space-y-1 bg-black/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                        <div><strong className="text-amber-300">1. {heroDef.skills.basic.name}:</strong> {heroDef.skills.basic.desc}</div>
                        <div><strong className="text-cyan-300">2. {heroDef.skills.skill1.name} (SP {heroDef.skills.skill1.spCost}):</strong> {heroDef.skills.skill1.desc}</div>
                        <div><strong className="text-purple-300">3. {heroDef.skills.skill2.name} (SP {heroDef.skills.skill2.spCost}):</strong> {heroDef.skills.skill2.desc}</div>
                        <div><strong className="text-rose-400">4. Tuyệt Kỹ {heroDef.skills.ultimate.name}:</strong> {heroDef.skills.ultimate.desc}</div>
                      </div>

                      {/* Upgrade Controls */}
                      {isOwned && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => handleUpgradeHero(heroDef.id)}
                            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1 transition-colors min-h-[40px]"
                          >
                            <Plus size={14} />
                            NÂNG CẤP ({upgradeCost} Vàng)
                          </button>

                          <button
                            disabled={!canStarUp}
                            onClick={() => handleStarUpHero(heroDef.id)}
                            className={`px-3 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-colors min-h-[40px] ${
                              canStarUp
                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Star size={14} />
                            TĂNG SAO ({owned.shards}/{starCost})
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM / BỐ TRÍ ĐỘI HÌNH 5 TƯỚNG */}
          {currentTab === 'TEAM' && (
            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-amber-400">Bố Trí Đội Hình 5 Tướng</h2>
                <p className="text-xs md:text-sm text-slate-400">Sắp xếp 5 danh tướng vào các vị trí chiến thuật Tiên Phong & Hậu Phương.</p>
              </div>

              {/* 5 Active Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {team.slice(0, 5).map((heroId, slotIdx) => {
                  const heroDef = HERO_DEFINITIONS[heroId] || HERO_DEFINITIONS['hero_trieu_van'];
                  const stats = getHeroStats(heroId);
                  const slotLabel = slotIdx < 2 ? `Tiên Phong #${slotIdx + 1}` : `Hậu Phương #${slotIdx - 1}`;

                  return (
                    <div
                      key={slotIdx}
                      className="rounded-2xl border-2 border-amber-400/60 bg-gradient-to-t from-slate-900 to-amber-950/30 p-3 flex flex-col items-center text-center gap-2 shadow-lg"
                    >
                      <div className="text-xs font-bold text-amber-400">{slotLabel}</div>
                      <div className="w-20 h-28 rounded-xl border border-amber-400 overflow-hidden bg-black relative">
                        {assets[heroDef.cardImage] && (
                          <img
                            src={ASSETS_MANIFEST[heroDef.cardImage]}
                            alt={heroDef.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute top-1 left-1 bg-black/80 text-[10px] font-bold px-1 py-0.5 rounded text-yellow-300">
                          {heroDef.rarity}
                        </span>
                      </div>

                      <div className="font-black text-xs md:text-sm text-white">{heroDef.name}</div>
                      <div className="text-[10px] text-yellow-400 font-bold">LC: {stats.power}</div>
                      <div className="text-[9px] text-slate-300">{heroDef.title}</div>
                    </div>
                  );
                })}
              </div>

              {/* Swap Selection Pool */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm md:text-base font-bold text-slate-300">Chọn Tướng Đổi Vào Đội Hình:</h3>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {Object.keys(ownedHeroes).map((heroId) => {
                    const def = HERO_DEFINITIONS[heroId];
                    const isInTeam = team.includes(heroId);
                    const stats = getHeroStats(heroId);

                    return (
                      <button
                        key={heroId}
                        onClick={() => {
                          if (isInTeam) return;
                          setTeam((prev) => [heroId, ...prev.filter((id) => id !== heroId)].slice(0, 5));
                          gameAudio.playCrispClick();
                        }}
                        className={`w-28 rounded-xl border p-2 shrink-0 flex flex-col items-center gap-1 transition-all min-h-[48px] ${
                          isInTeam
                            ? 'border-amber-400 bg-amber-500/20 opacity-80'
                            : 'border-slate-700 bg-slate-900 hover:border-amber-400 hover:scale-105'
                        }`}
                      >
                        <div className="w-14 h-16 rounded-lg overflow-hidden border border-slate-700">
                          {assets[def?.cardImage] && (
                            <img src={ASSETS_MANIFEST[def.cardImage]} alt={def?.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="text-xs font-black truncate w-full text-center">{def?.name}</div>
                        <div className="text-[10px] text-yellow-400">{stats.power} LC</div>
                        <div className="text-[9px] text-slate-400">{isInTeam ? 'Đang ra trận' : 'Bấm để đổi'}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GACHA / TẾ ĐÀN TRIỆU HỒI */}
          {currentTab === 'GACHA' && (
            <div className="relative flex-1 min-h-[550px] flex flex-col justify-between p-4 md:p-8 overflow-hidden">
              <img
                src={ASSETS_MANIFEST['bg_gacha_altar']}
                alt="Tế Đàn Triệu Hồi"
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-6 my-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-purple-400 text-purple-300 text-xs md:text-sm font-bold shadow-lg">
                  <Sparkles size={16} />
                  Tế Đàn Chiêu Mộ Thần Tướng Tam Quốc
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-rose-400 drop-shadow-xl">
                  TRIỆU HỒI TƯỚNG VÔ SONG
                </h2>

                <p className="text-xs md:text-sm text-slate-200 max-w-xl">
                  Cơ hội nhận thần tướng UR (Lữ Bố, Triệu Vân, Quan Vũ, Gia Cát Lượng) và SSR (Trương Phi, Tào Tháo, Điêu Thuyền).
                  Bảo hiểm 10 lần nhận SSR+, 50 lần nhận chắc chắn UR!
                </p>

                <div className="text-xs font-bold text-amber-300 bg-black/60 px-4 py-2 rounded-xl border border-amber-500/30">
                  Tiến độ bảo hiểm UR: <span className="text-white font-black">{pityCounter} / 50</span> lượt quay
                </div>

                {/* Summon Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                  {/* 1x Pull */}
                  <button
                    onClick={() => handleSummon(1)}
                    className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-base md:text-lg shadow-xl shadow-amber-500/30 transition-all flex flex-col items-center gap-1 hover:scale-105 active:scale-95 min-w-[180px] min-h-[64px]"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={20} />
                      TRIỆU HỒI X1
                    </div>
                    <div className="text-xs font-bold flex items-center gap-1 opacity-90">
                      {tickets > 0 ? (
                        <>
                          <img src={ASSETS_MANIFEST['icon_summon_ticket']} alt="Vé" className="w-4 h-4 object-contain" />
                          1 Vé Triệu Hồi
                        </>
                      ) : (
                        <>
                          <img src={ASSETS_MANIFEST['icon_diamond']} alt="Kim cương" className="w-4 h-4 object-contain" />
                          300 Kim Cương
                        </>
                      )}
                    </div>
                  </button>

                  {/* 10x Pull */}
                  <button
                    onClick={() => handleSummon(10)}
                    className="px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-base md:text-lg shadow-xl shadow-rose-600/30 transition-all flex flex-col items-center gap-1 hover:scale-105 active:scale-95 min-w-[200px] min-h-[64px]"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={20} />
                      TRIỆU HỒI X10 (Giảm 10%)
                    </div>
                    <div className="text-xs font-bold flex items-center gap-1 opacity-90 text-yellow-200">
                      <img src={ASSETS_MANIFEST['icon_diamond']} alt="Kim cương" className="w-4 h-4 object-contain" />
                      2,700 Kim Cương (Đảm bảo SSR+)
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: QUESTS / NHIỆM VỤ & PHÚC LỢI */}
          {currentTab === 'QUESTS' && (
            <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-amber-400">Nhiệm Vụ & Phúc Lợi</h2>
                <p className="text-xs md:text-sm text-slate-400">Nhận điểm danh hằng ngày và hoàn thành mục tiêu chiến dịch để nhận quà.</p>
              </div>

              {/* Daily Login Quest */}
              <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-900/90 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                    <Gift size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Điểm Danh Ngày Mới</h3>
                    <p className="text-xs text-slate-300">Nhận ngay 1,000 Kim Cương + 5 Vé Triệu Hồi</p>
                  </div>
                </div>

                <button
                  disabled={dailyClaimed}
                  onClick={() => {
                    if (dailyClaimed) return;
                    setDiamonds((prev) => prev + 1000);
                    setTickets((prev) => prev + 5);
                    setDailyClaimed(true);
                    gameAudio.playPowerupChime();
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all min-h-[44px] ${
                    dailyClaimed
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {dailyClaimed ? 'Đã Nhận' : 'NHẬN THƯỞNG'}
                </button>
              </div>

              {/* Stamina Refill Quest */}
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/90 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300">
                    <img src={ASSETS_MANIFEST['icon_stamina_bun']} alt="Bánh bao" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Hồi Phục Thể Lực</h3>
                    <p className="text-xs text-slate-300">Hồi đầy 120 điểm Thể Lực để tiếp tục chiến dịch</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStamina(getConfig('maxStamina') as number);
                    gameAudio.playCoinPickup();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm transition-all min-h-[44px]"
                >
                  HỒI ĐẦY
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM NAVIGATION BAR */}
          <nav className="w-full bg-slate-900/95 border-t border-slate-800 p-2 flex items-center justify-around z-20 shrink-0 gap-1 backdrop-blur-md">
            {[
              { tab: 'LOBBY', label: 'Trang Chủ', icon: <Flame size={18} /> },
              { tab: 'CAMPAIGN', label: 'Chiến Dịch', icon: <Swords size={18} /> },
              { tab: 'ROSTER', label: 'Tướng', icon: <Users size={18} /> },
              { tab: 'TEAM', label: 'Đội Hình', icon: <Shield size={18} /> },
              { tab: 'GACHA', label: 'Triệu Hồi', icon: <Sparkles size={18} /> },
              { tab: 'QUESTS', label: 'Nhiệm Vụ', icon: <Award size={18} /> },
            ].map(({ tab, label, icon }) => (
              <button
                key={tab}
                onClick={() => {
                  setCurrentTab(tab as MainTab);
                  gameAudio.playCrispClick();
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] min-w-[48px] ${
                  currentTab === tab
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40 font-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-semibold'
                }`}
              >
                {icon}
                <span className="text-[10px] md:text-xs mt-0.5">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* --- MODAL: GACHA RESULTS REVEAL OVERLAY --- */}
      {gachaResults && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-400 rounded-2xl p-6 flex flex-col items-center text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl md:text-4xl font-black text-amber-400 flex items-center gap-2">
              <Sparkles size={28} />
              KẾT QUẢ TRIỆU HỒI
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-h-[60vh] overflow-y-auto p-2">
              {gachaResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border-2 p-2 flex flex-col items-center gap-1.5 ${RARITY_INFO[item.hero.rarity].bg} ${RARITY_INFO[item.hero.rarity].border} shadow-lg`}
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-700 bg-black relative">
                    {assets[item.hero.cardImage] && (
                      <img src={ASSETS_MANIFEST[item.hero.cardImage]} alt={item.hero.name} className="w-full h-full object-cover" />
                    )}
                    <span className={`absolute top-0.5 left-0.5 text-[9px] font-black px-1 rounded ${RARITY_INFO[item.hero.rarity].bg} ${RARITY_INFO[item.hero.rarity].text}`}>
                      {item.hero.rarity}
                    </span>
                  </div>

                  <div className="text-xs font-black truncate w-full">{item.hero.name}</div>
                  <div className="text-[10px] font-bold text-amber-300">
                    {item.isNew ? '🎉 MỚI!' : '+15 Mảnh'}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setGachaResults(null);
                gameAudio.playCrispClick();
              }}
              autoFocus
              className="px-8 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black text-base shadow-lg shadow-amber-500/30 transition-all min-h-[48px]"
            >
              XÁC NHẬN
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* --- MODAL: CINEMATIC ULTIMATE CUT-IN OVERLAY --- */}
      {ultimateHero && !skipUltimateAnim && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden bg-black/75 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl flex items-center justify-center">
            {/* Elemental Energy Slash Banner */}
            <div className="absolute inset-x-0 h-44 bg-gradient-to-r from-transparent via-amber-600/90 to-transparent transform -skew-y-3" />
            <div className="relative flex items-center gap-6 px-6 z-10">
              <div className="w-36 h-36 md:w-52 md:h-52 rounded-full border-4 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.9)] overflow-hidden bg-black shrink-0 animate-pulse ring-4 ring-yellow-300">
                {assets[ultimateHero.cardImage] && (
                  <img
                    src={ASSETS_MANIFEST[ultimateHero.cardImage]}
                    alt={ultimateHero.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="space-y-2 text-left">
                <div className="text-xs md:text-sm font-black text-yellow-300 tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles size={16} />
                  ⚡ TUYỆT KỸ BỘC PHÁ 5V5 ⚡
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                  {ultimateHero.skills.ultimate.name}
                </h2>
                <p className="text-xs md:text-sm font-bold text-amber-200 italic">
                  "{ultimateHero.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- OVERLAY: PAUSED --- */}
      {gameState.status === 'PAUSED' && (
        <Overlay
          title="TẠM DỪNG TRẬN ĐẤU"
          description="Bấm Tiếp Tục hoặc phím Esc để quay lại trận chiến"
          actionLabel="TIẾP TỤC"
          onAction={() => setGameState((prev) => ({ ...prev, status: 'PLAYING' }))}
          icon={<Play size={20} />}
          tone="neutral"
        />
      )}

      {/* --- OVERLAY: GAME OVER --- */}
      {gameState.status === 'GAME_OVER' && (
        <Overlay
          title="TRẬN CHIẾN THẤT BẠI"
          description="Toàn bộ 5 danh tướng đã ngã xuống. Hãy nâng cấp level, trang bị và thử lại!"
          actionLabel="THỬ LẠI ẢI NÀY"
          onAction={() => startCombat(activeStageRef.current)}
          icon={<RotateCw size={20} />}
          tone="danger"
        />
      )}

      {/* --- OVERLAY: VICTORY --- */}
      {gameState.status === 'VICTORY' && (
        <Overlay
          title="CHIẾN THẮNG HUY HOÀNG"
          description={`Ải đã được chinh phục thành công! Nhận +${activeStageRef.current.goldReward} Vàng và +${activeStageRef.current.diamondReward} Kim Cương.`}
          actionLabel="TIẾP TỤC"
          onAction={() => {
            setGameState({ status: 'START', score: 0, level: 1 });
            setCurrentTab('CAMPAIGN');
          }}
          icon={<Trophy size={20} />}
          tone="victory"
        />
      )}

      {/* --- MODAL: SETTINGS & AUDIO CONTROLS --- */}
      {isSettingsOpen && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 flex flex-col space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Settings size={20} />
                Cài Đặt Hệ Thống
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Audio Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <Volume2 size={18} />
                  Nhạc Nền (BGM)
                </span>
                <button
                  onClick={() => setIsMusicMuted((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-[36px] ${
                    !isMusicMuted ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isMusicMuted ? 'TẮT' : 'BẬT'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <VolumeX size={18} />
                  Âm Thanh Hiệu Ứng (SFX)
                </span>
                <button
                  onClick={() => {
                    const next = gameAudio.toggleMute();
                    setIsSfxMuted(next);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-[36px] ${
                    !isSfxMuted ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isSfxMuted ? 'TẮT' : 'BẬT'}
                </button>
              </div>
            </div>

            {/* How to play button */}
            <button
              onClick={() => {
                setIsSettingsOpen(false);
                setIsHowToPlayOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-sm text-slate-200 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <HelpCircle size={18} />
              Hướng Dẫn Chơi Game 5v5
            </button>

            {/* Reset Data */}
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn đặt lại dữ liệu trò chơi không?')) {
                  localStorage.removeItem(STORAGE_KEY);
                  window.location.reload();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 font-bold text-xs text-red-300 transition-colors min-h-[44px]"
            >
              Đặt Lại Toàn Bộ Dữ Liệu
            </button>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition-colors min-h-[44px]"
            >
              ĐÓNG
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* --- MODAL: HOW TO PLAY --- */}
      {isHowToPlayOpen && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 flex flex-col space-y-4 shadow-2xl text-slate-200">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpCircle size={20} />
              Hướng Dẫn Chơi 5v5 Theo Lượt (Turn-Based RPG)
            </h2>

            <div className="space-y-3 text-xs md:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <strong className="text-amber-300">1. Thanh Thứ Tự Lượt Đi (Timeline):</strong> Các tướng di chuyển theo chỉ số Tốc Độ (Speed). Tướng nhanh nhất sẽ hành động trước. Tướng bị Choáng (Stun) hoặc Đóng Băng (Freeze) sẽ bị mất lượt.
              </div>
              <div>
                <strong className="text-amber-300">2. Bảng Hành Động Trong Lượt:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>Đánh Thường:</strong> Tấn công 1 mục tiêu và nạp ngay +25 Nộ.</li>
                  <li><strong>Kỹ Năng 1 & 2:</strong> Tiêu hao điểm SP, có thời gian hồi chiêu (CD), gây sát thương diện rộng hoặc hiệu ứng khống chế.</li>
                  <li><strong>Tuyệt Kỹ (Chiêu Cuối):</strong> Yêu cầu đầy 100 Nộ Khí. Kích hoạt hoạt ảnh cắt cảnh bộc phá và sát thương diệt thế.</li>
                  <li><strong>Phòng Thủ:</strong> Vào tư thế thủ, giảm 50% toàn bộ sát thương gánh chịu cho đến lượt tiếp theo.</li>
                  <li><strong>Hủy / Quay lại:</strong> Bấm [HỦY] để đổi lại kỹ năng hoặc chọn lại mục tiêu mà không mất lượt.</li>
                </ul>
              </div>
              <div>
                <strong className="text-amber-300">3. Phạm Vi Mục Tiêu (AoE):</strong>
                <p>Đơn thể (1 mục tiêu), Hàng ngang (Row), Cột dọc (Column), hoặc Toàn thể (All). Bấm trực tiếp vào tướng đối phương hoặc đồng minh trên màn hình để chuyển đổi mục tiêu!</p>
              </div>
              <div>
                <strong className="text-amber-300">4. Khắc Chế Ngũ Hành:</strong>
                <p>Phong &gt; Lôi &gt; Băng &gt; Hỏa &gt; Phong (Gây 150% sát thương bạo kích khi có lợi thế hệ). Nguyệt gây 125% sát thương lên toàn bộ các hệ.</p>
              </div>
            </div>

            <button
              onClick={() => setIsHowToPlayOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition-colors min-h-[44px]"
            >
              ĐÃ HIỂU
            </button>
          </div>
        </MenuOverlay>
      )}
    </div>
  );
}
