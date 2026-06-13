import type { Work, Author, Category, Difficulty } from '../types';
import { getWorks, saveWorks, getAuthors, saveAuthors } from './storage';

const PLACEHOLDER_COLORS = [
  '#f4e1d2', '#d4e2d4', '#d2d4f4', '#f4d2e2',
  '#e2d4f4', '#d2f4e8', '#f4e8d2', '#d2e8f4',
];

function placeholder(seed: number, w: number, h: number, emoji: string): string {
  const color = PLACEHOLDER_COLORS[seed % PLACEHOLDER_COLORS.length];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="${color}" width="${w}" height="${h}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="${Math.min(w, h) * 0.3}">${emoji}</text></svg>`
  )}`;
}

const AUTHORS: Author[] = [
  { id: 'a1', name: '小林烘焙', avatar: placeholder(0, 100, 100, '👩‍🍳'), bio: '专注法式甜点5年，分享每一份甜蜜', workCount: 3, followers: [] },
  { id: 'a2', name: '编织达人阿花', avatar: placeholder(1, 100, 100, '🧶'), bio: '毛线就是我的画笔', workCount: 2, followers: [] },
  { id: 'a3', name: '木匠老王', avatar: placeholder(2, 100, 100, '🪵'), bio: '三十年木工手艺，每一件都是独一无二', workCount: 2, followers: [] },
  { id: 'a4', name: '陶语工作室', avatar: placeholder(3, 100, 100, '🏺'), bio: '用泥土诉说故事', workCount: 2, followers: [] },
  { id: 'a5', name: '皮匠小陈', avatar: placeholder(4, 100, 100, '👜'), bio: '手工皮具，匠心独运', workCount: 2, followers: [] },
  { id: 'a6', name: '花间集', avatar: placeholder(5, 100, 100, '🌸'), bio: '让花艺走进日常', workCount: 2, followers: [] },
];

const WORKS: Work[] = [
  // 烘焙
  {
    id: 'w1', title: '经典法式可颂面包', category: '烘焙', difficulty: '较难',
    cover: placeholder(0, 400, 500, '🥐'), authorId: 'a1',
    description: '层层酥脆的法式可颂，从面团折叠到出炉的完整过程。',
    steps: [
      { image: placeholder(0, 600, 400, '🥛'), text: '准备材料：高筋面粉300g、黄油200g（片状）、牛奶150ml、酵母5g、糖40g、盐6g、蛋液适量。将面粉、牛奶、酵母、糖、盐混合揉成光滑面团。' },
      { image: placeholder(1, 600, 400, '🧊'), text: '将黄油片擀成薄片，面团也擀成长方形。把黄油片包入面团中，进行第一次三折。' },
      { image: placeholder(2, 600, 400, '🔄'), text: '冷藏松弛30分钟后，再进行两次三折。每次折叠后都要冷藏松弛。这是形成层次的关键步骤。' },
      { image: placeholder(3, 600, 400, '🔺'), text: '最终擀薄至4mm厚，切成三角形，从宽边卷起成可颂形状。' },
      { image: placeholder(4, 600, 400, '🌡️'), text: '30°C发酵约2小时至1.5倍大，刷蛋液，200°C烤15-18分钟至金黄色。' },
    ],
    materials: [
      { name: '高筋面粉', amount: '300g' }, { name: '黄油（片状）', amount: '200g' },
      { name: '牛奶', amount: '150ml' }, { name: '干酵母', amount: '5g' },
      { name: '细砂糖', amount: '40g' }, { name: '盐', amount: '6g' },
    ],
    tips: '黄油和面团的温度要一致，太软或太硬都会影响层次。折叠次数不要少于三次。',
    likes: ['u1', 'u2', 'u3'], favorites: ['u1'], comments: [
      { id: 'c1', userId: 'u1', userName: '手工爱好者', userAvatar: placeholder(6, 60, 60, '😊'), text: '层次太美了，请问可以用普通黄油代替片状黄油吗？', createdAt: 1700000000000 },
      { id: 'c2', userId: 'u2', userName: '烘焙新手', userAvatar: placeholder(7, 60, 60, '🤗'), text: '试做了一次，虽然没有完美层次但味道很好！', createdAt: 1700100000000 },
    ],
    createdAt: 1700000000000, published: true,
  },
  {
    id: 'w2', title: '日式轻芝士蛋糕', category: '烘焙', difficulty: '中等',
    cover: placeholder(1, 400, 450, '🍰'), authorId: 'a1',
    description: '入口即化的轻芝士蛋糕，口感绵密细腻。',
    steps: [
      { image: placeholder(0, 600, 400, '🧀'), text: '奶油芝士200g隔水软化，加入蛋黄3个、牛奶50ml搅拌均匀。' },
      { image: placeholder(1, 600, 400, '🥄'), text: '筛入低筋面粉40g和玉米淀粉20g，拌匀成蛋黄糊。' },
      { image: placeholder(2, 600, 400, '🥚'), text: '蛋白加60g糖打至湿性发泡，分三次与蛋黄糊翻拌均匀。' },
      { image: placeholder(3, 600, 400, '🔥'), text: '水浴法160°C烤60分钟，关火后在烤箱中焖10分钟防止回缩。' },
    ],
    materials: [
      { name: '奶油芝士', amount: '200g' }, { name: '鸡蛋', amount: '3个' },
      { name: '牛奶', amount: '50ml' }, { name: '低筋面粉', amount: '40g' },
      { name: '玉米淀粉', amount: '20g' }, { name: '细砂糖', amount: '60g' },
    ],
    tips: '蛋白不要打到硬性发泡，否则蛋糕容易开裂。水浴法的水要用热水。',
    likes: ['u2'], favorites: ['u2', 'u3'], comments: [],
    createdAt: 1699900000000, published: true,
  },
  {
    id: 'w3', title: '伯爵红茶曲奇', category: '烘焙', difficulty: '简单',
    cover: placeholder(2, 400, 380, '🍪'), authorId: 'a1',
    description: '酥脆的红茶曲奇，下午茶的完美搭配。',
    steps: [
      { image: placeholder(0, 600, 400, '🫖'), text: '黄油100g软化后加糖粉50g打发，加入一个蛋黄搅匀。' },
      { image: placeholder(1, 600, 400, '🍃'), text: '伯爵红茶碎5g和低筋面粉150g过筛加入，拌成面团。' },
      { image: placeholder(2, 600, 400, '🔪'), text: '整形成长条放冰箱冷冻1小时，取出切5mm厚片。' },
      { image: placeholder(3, 600, 400, '⏰'), text: '170°C烤15分钟至边缘微黄即可。' },
    ],
    materials: [
      { name: '黄油', amount: '100g' }, { name: '糖粉', amount: '50g' },
      { name: '蛋黄', amount: '1个' }, { name: '伯爵红茶', amount: '5g' },
      { name: '低筋面粉', amount: '150g' },
    ],
    tips: '红茶用研磨机打碎效果更好，颗粒太大会影响口感。',
    likes: ['u1', 'u3'], favorites: [], comments: [],
    createdAt: 1699800000000, published: true,
  },

  // 编织
  {
    id: 'w4', title: '冰条线手提包', category: '编织', difficulty: '简单',
    cover: placeholder(3, 400, 480, '🧶'), authorId: 'a2',
    description: '用冰条线编织的时尚手提包，结实耐用又好看。',
    steps: [
      { image: placeholder(0, 600, 400, '🧵'), text: '准备冰条线3团（约300g）、8mm钩针。起针40个锁针作为包底长度。' },
      { image: placeholder(1, 600, 400, '📐'), text: '围绕起针链钩短针，两端各加3针形成椭圆底部，钩6圈。' },
      { image: placeholder(2, 600, 400, '👜'), text: '不加不减钩包身12圈，然后分出提手位置，中间留10针不钩。' },
      { image: placeholder(3, 600, 400, '✨'), text: '提手部分钩20行短针，缝合连接，收线头。' },
    ],
    materials: [
      { name: '冰条线', amount: '300g' }, { name: '8mm钩针', amount: '1根' },
      { name: '记号扣', amount: '4个' }, { name: '缝合针', amount: '1根' },
    ],
    tips: '冰条线钩的时候不要太紧，否则成品会变形。提手部分可以钩双层更结实。',
    likes: ['u1', 'u2', 'u3', 'u4'], favorites: ['u1', 'u2'], comments: [
      { id: 'c3', userId: 'u3', userName: '编织小白', userAvatar: placeholder(0, 60, 60, '😄'), text: '冰条线哪里买比较实惠呀？', createdAt: 1700200000000 },
    ],
    createdAt: 1699700000000, published: true,
  },
  {
    id: 'w5', title: '渐变色围巾', category: '编织', difficulty: '中等',
    cover: placeholder(4, 400, 520, '🧣'), authorId: 'a2',
    description: '使用渐变毛线编织的温暖围巾，每个花纹都是独一无二的。',
    steps: [
      { image: placeholder(0, 600, 400, '🎨'), text: '选用渐变色毛线3团、5mm棒针。起60针。' },
      { image: placeholder(1, 600, 400, '〰️'), text: '采用元宝针法：第一行1上1下交替，第二行织上针的上针、下针滑过不织。' },
      { image: placeholder(2, 600, 400, '📏'), text: '重复针法直到围巾长约180cm，收针。' },
      { image: placeholder(3, 600, 400, '🎀'), text: '两端各做8cm的流苏装饰。' },
    ],
    materials: [
      { name: '渐变色毛线', amount: '300g' }, { name: '5mm棒针', amount: '1副' },
      { name: '缝合针', amount: '1根' },
    ],
    tips: '元宝针弹性大，起针数可以少一些。围巾宽度可自行调整起针数。',
    likes: ['u3'], favorites: ['u1'], comments: [],
    createdAt: 1699600000000, published: true,
  },

  // 木工
  {
    id: 'w6', title: '原木砧板', category: '木工', difficulty: '中等',
    cover: placeholder(5, 400, 400, '🪵'), authorId: 'a3',
    description: '用黑胡桃木制作的整块砧板，纹理漂亮经久耐用。',
    steps: [
      { image: placeholder(0, 600, 400, '🪓'), text: '选一块厚度4cm的黑胡桃木板，标记出砧板形状（约40x28cm）。' },
      { image: placeholder(1, 600, 400, '⚙️'), text: '用线锯或带锯沿标记线切割，然后用刨子将表面刨平。' },
      { image: placeholder(2, 600, 400, '🪚'), text: '砂纸从80目逐级打磨到400目，边缘倒圆角处理。' },
      { image: placeholder(3, 600, 400, '🫒'), text: '涂抹食品级矿物油3-4遍，每遍间隔6小时。最后用蜂蜡抛光。' },
    ],
    materials: [
      { name: '黑胡桃木板', amount: '40x28x4cm' }, { name: '砂纸套装', amount: '80-400目' },
      { name: '食品级矿物油', amount: '100ml' }, { name: '天然蜂蜡', amount: '30g' },
    ],
    tips: '一定要用食品级矿物油，不要用植物油（会发臭）。定期保养可以延长使用寿命。',
    likes: ['u1', 'u4'], favorites: ['u3'], comments: [
      { id: 'c4', userId: 'u4', userName: '木工爱好者', userAvatar: placeholder(2, 60, 60, '🪓'), text: '请问新手适合从这个项目开始学吗？', createdAt: 1700300000000 },
    ],
    createdAt: 1699500000000, published: true,
  },
  {
    id: 'w7', title: '榫卯小板凳', category: '木工', difficulty: '较难',
    cover: placeholder(6, 400, 420, '🪑'), authorId: 'a3',
    description: '不用一颗钉子，纯榫卯结构的传统小板凳。',
    steps: [
      { image: placeholder(0, 600, 400, '📐'), text: '设计图纸：凳面30x30cm，高25cm。准备松木板若干。' },
      { image: placeholder(1, 600, 400, '🪚'), text: '制作凳面：三块板拼接，用凿子开卯眼。' },
      { image: placeholder(2, 600, 400, '🔨'), text: '制作四条腿和横枨，腿上端开榫头，横枨两端也开榫头。' },
      { image: placeholder(3, 600, 400, '🔧'), text: '试组装确认配合紧密后，涂胶组装，用夹具固定24小时。' },
      { image: placeholder(4, 600, 400, '✨'), text: '打磨至光滑，涂木蜡油两遍，完成。' },
    ],
    materials: [
      { name: '松木板', amount: '若干' }, { name: '木工胶', amount: '1瓶' },
      { name: '木蜡油', amount: '200ml' }, { name: '砂纸', amount: '180-320目' },
    ],
    tips: '榫卯配合要精确，太松不牢固，太紧会撑裂。建议先用废料练习。',
    likes: ['u2', 'u5'], favorites: ['u4'], comments: [],
    createdAt: 1699400000000, published: true,
  },

  // 陶艺
  {
    id: 'w8', title: '手捏咖啡杯', category: '陶艺', difficulty: '简单',
    cover: placeholder(7, 400, 440, '☕'), authorId: 'a4',
    description: '用泥条盘筑法制作独一无二的手捏咖啡杯。',
    steps: [
      { image: placeholder(0, 600, 400, '🏺'), text: '取一块陶泥约500g，揉泥排气。先捏出一个泥片作为杯底（直径约7cm）。' },
      { image: placeholder(1, 600, 400, '🐍'), text: '搓一根长泥条（直径约8mm），盘绕在杯底上，每圈用手指抹平内侧接缝。' },
      { image: placeholder(2, 600, 400, '🔄'), text: '逐圈盘筑到约8cm高，稍微收口形成杯子形状。搓一个把手粘在侧面。' },
      { image: placeholder(3, 600, 400, '🖌️'), text: '阴干2-3天后修整表面。上釉后放入电窑1230°C烧制。' },
    ],
    materials: [
      { name: '陶泥', amount: '500g' }, { name: '泥浆', amount: '适量' },
      { name: '釉料', amount: '适量' },
    ],
    tips: '接缝一定要抹平，否则烧制时容易开裂。杯子壁厚保持5mm左右最佳。',
    likes: ['u1', 'u2', 'u3'], favorites: ['u1', 'u5'], comments: [],
    createdAt: 1699300000000, published: true,
  },
  {
    id: 'w9', title: '花器——侘寂风花瓶', category: '陶艺', difficulty: '中等',
    cover: placeholder(0, 400, 500, '🏺'), authorId: 'a4',
    description: '不对称的手工花瓶，诠释日式侘寂美学。',
    steps: [
      { image: placeholder(0, 600, 400, '🫧'), text: '拉坯成型：取1kg陶泥上拉坯机，拉出瓶身，瓶口有意做成不规则形状。' },
      { image: placeholder(1, 600, 400, '🤲'), text: '修坯：半干状态时用修坯刀修薄瓶壁，调整形状。' },
      { image: placeholder(2, 600, 400, '🎨'), text: '上釉：内部施透明釉防漏水，外部施铁锈花釉。' },
      { image: placeholder(3, 600, 400, '🔥'), text: '入窑烧制：氧化气氛1250°C，烧制时间约10小时，自然冷却。' },
    ],
    materials: [
      { name: '瓷泥', amount: '1kg' }, { name: '透明釉', amount: '200ml' },
      { name: '铁锈花釉', amount: '300ml' },
    ],
    tips: '侘寂风的精髓在于不完美，不要刻意追求对称。釉面的窑变效果每次都不一样。',
    likes: ['u4', 'u5'], favorites: ['u2'], comments: [],
    createdAt: 1699200000000, published: true,
  },

  // 皮具
  {
    id: 'w10', title: '植鞣革短夹', category: '皮具', difficulty: '中等',
    cover: placeholder(1, 400, 380, '👛'), authorId: 'a5',
    description: '意大利植鞣革手工缝制的简约短夹，越用越有质感。',
    steps: [
      { image: placeholder(0, 600, 400, '📏'), text: '纸版设计并裁切皮料：外皮1片、内页卡位4片、零钱袋1片。' },
      { image: placeholder(1, 600, 400, '🪡'), text: '用间距规在皮边3mm处标记缝线位置，用菱斩打孔。' },
      { image: placeholder(2, 600, 400, '🧵'), text: '用双针马鞍缝法缝合各部件，蜡线要拉紧。' },
      { image: placeholder(3, 600, 400, '✂️'), text: '边缘用砂纸打磨光滑，涂边油反复3遍，每遍干后再涂下一遍。' },
    ],
    materials: [
      { name: '意大利植鞣革', amount: '1.2mm厚，2平方尺' },
      { name: '蜡线', amount: '3m' }, { name: '边油', amount: '1瓶' },
      { name: '菱斩', amount: '1套' },
    ],
    tips: '植鞣革最大的魅力在于会变色，使用一段时间后会变成漂亮的蜜色。',
    likes: ['u1', 'u3', 'u4'], favorites: ['u3', 'u4'], comments: [
      { id: 'c5', userId: 'u5', userName: '手作匠人', userAvatar: placeholder(4, 60, 60, '😎'), text: '第一次做皮具推荐从这个开始，难度适中成品也很实用！', createdAt: 1700400000000 },
    ],
    createdAt: 1699100000000, published: true,
  },
  {
    id: 'w11', title: '钥匙扣挂件', category: '皮具', difficulty: '简单',
    cover: placeholder(2, 400, 360, '🔑'), authorId: 'a5',
    description: '入门级皮具小物，10分钟就能完成。',
    steps: [
      { image: placeholder(0, 600, 400, '📐'), text: '裁切一块3x8cm的植鞣革，一端切圆角。' },
      { image: placeholder(1, 600, 400, '🔨'), text: '在圆角端打一个安装鸡眼扣的孔，安装鸡眼扣。' },
      { image: placeholder(2, 600, 400, '🎨'), text: '可以烙印字母或图案作为个性化装饰。' },
      { image: placeholder(3, 600, 400, '🔗'), text: '穿过钥匙圈，完成！' },
    ],
    materials: [
      { name: '植鞣革碎料', amount: '3x8cm' }, { name: '鸡眼扣', amount: '1个' },
      { name: '钥匙圈', amount: '1个' },
    ],
    tips: '可以一次做很多个送朋友，是非常好的小礼物。',
    likes: ['u2'], favorites: [], comments: [],
    createdAt: 1699000000000, published: true,
  },

  // 花艺
  {
    id: 'w12', title: '韩式花束包装教程', category: '花艺', difficulty: '简单',
    cover: placeholder(3, 400, 520, '💐'), authorId: 'a6',
    description: '学会韩式花束包装，自己包出花店水准。',
    steps: [
      { image: placeholder(0, 600, 400, '🌹'), text: '选花材：主花3-5枝（如玫瑰），配花5-7枝（满天星、尤加利叶等）。' },
      { image: placeholder(1, 600, 400, '🤲'), text: '螺旋手法握花：每加一枝花都朝同一方向旋转45度，形成螺旋花束。' },
      { image: placeholder(2, 600, 400, '📦'), text: '用韩素纸包装：先放一张在后面做底，左右各包一张，前面再加一张。' },
      { image: placeholder(3, 600, 400, '🎀'), text: '系上丝带蝴蝶结，修剪花脚至统一长度。' },
    ],
    materials: [
      { name: '主花（玫瑰等）', amount: '3-5枝' }, { name: '配花', amount: '5-7枝' },
      { name: '韩素纸', amount: '4张' }, { name: '丝带', amount: '1m' },
    ],
    tips: '螺旋手法是花艺基础，多练习几次就能掌握。花束不要太大，精致小巧更有韩式风格。',
    likes: ['u1', 'u2', 'u3', 'u4', 'u5'], favorites: ['u1', 'u2', 'u3'], comments: [
      { id: 'c6', userId: 'u1', userName: '手工爱好者', userAvatar: placeholder(6, 60, 60, '😊'), text: '终于学会螺旋手法了，包出来的花束好好看！', createdAt: 1700500000000 },
      { id: 'c7', userId: 'u6', userName: '花艺学徒', userAvatar: placeholder(5, 60, 60, '🌼'), text: '请问韩素纸和普通包装纸有什么区别？', createdAt: 1700600000000 },
    ],
    createdAt: 1698900000000, published: true,
  },
  {
    id: 'w13', title: '永生花相框', category: '花艺', difficulty: '中等',
    cover: placeholder(4, 400, 460, '🖼️'), authorId: 'a6',
    description: '把鲜花做成永生花相框，留住最美的瞬间。',
    steps: [
      { image: placeholder(0, 600, 400, '🌹'), text: '准备永生花材：主花2-3朵、小花若干、叶子、苔藓。选一个中空相框。' },
      { image: placeholder(1, 600, 400, '🎨'), text: '在相框底板上用热熔胶先铺一层苔藓作为底色。' },
      { image: placeholder(2, 600, 400, '💐'), text: '按照由大到小的顺序粘贴花材，主花在中间偏左或偏右，形成不对称构图。' },
      { image: placeholder(3, 600, 400, '✨'), text: '空隙处填入小花和叶子，最后可以喷少量定型液。' },
    ],
    materials: [
      { name: '永生花材套装', amount: '1套' }, { name: '中空相框', amount: '1个' },
      { name: '热熔胶枪', amount: '1把' }, { name: '苔藓', amount: '适量' },
    ],
    tips: '永生花怕潮湿，不要放在卫生间。构图不要太满，留白更有意境。',
    likes: ['u3', 'u5'], favorites: ['u4', 'u5'], comments: [],
    createdAt: 1698800000000, published: true,
  },
];

export function seedIfNeeded(): void {
  if (getWorks().length === 0) {
    saveWorks(WORKS);
  }
  if (getAuthors().length === 0) {
    saveAuthors(AUTHORS);
  }
}
