/** Демо-каталог для быстрого старта. Фото — CC0 (Unsplash через Wikimedia Commons), уже загружены в хранилище Chatium. */

export const DEMO_CATEGORIES = [
  { name: 'Кухня', slug: 'kitchen', imageHash: 'image_msk_n3uXeYNRoE.1600x1068.jpeg', description: 'Посуда и аксессуары для готовки' },
  { name: 'Свет', slug: 'light', imageHash: 'image_msk_ddFRzpu6Xf.1600x1068.jpeg', description: 'Лампы, гирлянды и свечи' },
  { name: 'Текстиль', slug: 'textile', imageHash: 'image_msk_Rrc6SP434v.1201x1600.jpeg', description: 'Пледы, подушки, полотенца' },
  { name: 'Декор', slug: 'decor', imageHash: 'image_msk_NuSz6rqtnr.1600x1067.jpeg', description: 'Вазы, кашпо и мелочи для уюта' },
  { name: 'Хранение', slug: 'storage', imageHash: 'image_msk_5Pf1XEQYrX.1600x1035.jpeg', description: 'Корзины, банки и органайзеры' },
]

type DemoProduct = {
  title: string
  description: string
  price: number
  oldPrice?: number
  category: string
  imageHash: string
  stock: number
  featured?: boolean
  badge?: string
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    title: 'Керамическая кружка Sun',
    description:
      'Кружка объёмом 350 мл с жёлтой полоской и глянцевой глазурью. Толстые стенки долго держат тепло, а широкая ручка удобна даже в варежках. Можно мыть в посудомоечной машине.',
    price: 1290,
    category: 'kitchen',
    imageHash: 'image_msk_epif9XSTLF.1600x1067.jpeg',
    stock: 42,
    featured: true,
    badge: 'Хит',
  },
  {
    title: 'Салатник White, 2 шт.',
    description:
      'Две глубокие миски диаметром 20 см из белой каменной керамики. Подходят для салатов, супов и подачи закусок; выдерживают духовку до 200 °C и посудомоечную машину.',
    price: 2490,
    oldPrice: 2990,
    category: 'kitchen',
    imageHash: 'image_msk_wDfaoxLxVJ.1600x1067.jpeg',
    stock: 18,
    featured: true,
  },
  {
    title: 'Разделочная доска из дуба',
    description:
      'Массив дуба, пропитка пищевым маслом, размер 40×25 см. Двусторонняя: одна сторона для хлеба и сыра, другая — для овощей. С кожаным ремешком для хранения на крючке.',
    price: 2190,
    category: 'kitchen',
    imageHash: 'image_msk_n3uXeYNRoE.1600x1068.jpeg',
    stock: 25,
  },
  {
    title: 'Чугунный чайник Indigo, 800 мл',
    description:
      'Заварочный чайник из чугуна с эмалированной внутренней поверхностью и стальным ситечком. Долго держит тепло, отлично раскрывает улун и чёрные чаи.',
    price: 3790,
    category: 'kitchen',
    imageHash: 'image_msk_YtpQ9Ri2Wb.1600x1067.jpeg',
    stock: 12,
    badge: 'Новинка',
  },
  {
    title: 'Настольная лампа Loft',
    description:
      'Лампа с чёрным металлическим основанием и открытым патроном под декоративную лампу Эдисона. Тёплый рассеянный свет для чтения и вечернего отдыха. Патрон E27, лампочка в комплекте.',
    price: 4990,
    category: 'light',
    imageHash: 'image_msk_E2mTz7rUbt.1600x1067.jpeg',
    stock: 9,
    featured: true,
  },
  {
    title: 'Лампа Edison Filament, E27',
    description:
      'Декоративная лампа с видимой спиралью и янтарным стеклом. Тёплый свет 2200 K, диммируется. Отлично смотрится в открытых светильниках и гирляндах.',
    price: 690,
    category: 'light',
    imageHash: 'image_msk_ST1XnjBufJ.1600x1064.jpeg',
    stock: 80,
  },
  {
    title: 'Гирлянда Stars, 5 м',
    description:
      'Сто тёплых светодиодов на медной проволоке, питание от USB. Восемь режимов свечения и таймер. Легко обвивает полку, зеркало или изголовье кровати.',
    price: 890,
    oldPrice: 1190,
    category: 'light',
    imageHash: 'image_msk_ddFRzpu6Xf.1600x1068.jpeg',
    stock: 64,
    badge: 'Скидка',
  },
  {
    title: 'Ароматическая свеча Forest',
    description:
      'Соевый воск, хлопковый фитиль, аромат хвои и мха. Горит около 40 часов. Стеклянный стакан после можно использовать под мелочи или как подсвечник.',
    price: 1490,
    category: 'light',
    imageHash: 'image_msk_ie18YhLWax.1600x1067.jpeg',
    stock: 30,
    featured: true,
  },
  {
    title: 'Плед Nordic, 130×170',
    description:
      'Мягкий плед из смеси шерсти и акрила с крупной вязкой. Не колется, не садится после стирки. Три классических оттенка — сливочный, серый и терракотовый.',
    price: 3990,
    category: 'textile',
    imageHash: 'image_msk_Rrc6SP434v.1201x1600.jpeg',
    stock: 15,
    featured: true,
    badge: 'Хит',
  },
  {
    title: 'Подушки Linen, набор 2 шт.',
    description:
      'Две подушки 50×70 см в чехлах из мягкого льна с потайной молнией. Наполнитель из холлофайбера держит форму и легко стирается.',
    price: 2390,
    category: 'textile',
    imageHash: 'image_msk_NYeXZAvr5W.1600x1067.jpeg',
    stock: 27,
  },
  {
    title: 'Пляжное полотенце Stripe',
    description:
      'Полотенце 90×170 см из плотного хлопка в яркую полоску. Быстро сохнет, не оставляет ворса и с каждой стиркой становится мягче.',
    price: 1690,
    category: 'textile',
    imageHash: 'image_msk_Ecvk14oaYV.1600x1067.jpeg',
    stock: 20,
  },
  {
    title: 'Фартук Craft из вощёного хлопка',
    description:
      'Плотный фартук с кожаными лямками и карманом на груди. Подходит для кухни, мастерской и сада. Регулируется по росту.',
    price: 2290,
    category: 'textile',
    imageHash: 'image_msk_sGQfCX3K0E.1600x1067.jpeg',
    stock: 14,
    badge: 'Новинка',
  },
  {
    title: 'Кувшин-ваза Milk, 1,2 л',
    description:
      'Белый керамический кувшин, который одинаково хорошо смотрится с тюльпанами и на столе с лимонадом. Устойчивое утяжелённое дно.',
    price: 2290,
    category: 'decor',
    imageHash: 'image_msk_NuSz6rqtnr.1600x1067.jpeg',
    stock: 11,
    featured: true,
  },
  {
    title: 'Кашпо Terra, набор 3 шт.',
    description:
      'Терракотовые кашпо трёх размеров с дренажными отверстиями и поддонами. Дышащая керамика помогает корням не загнивать. Подходят для суккулентов, фикуса и трав.',
    price: 1490,
    category: 'decor',
    imageHash: 'image_msk_AFYOSeQjeU.1114x1600.jpeg',
    stock: 40,
  },
  {
    title: 'Постер «Озеро в горах», А2',
    description:
      'Фотопостер на плотной матовой бумаге 250 г/м². Печать пигментными чернилами, не выцветает. Рама в комплект не входит.',
    price: 990,
    category: 'decor',
    imageHash: 'image_msk_Zoyl96VyYo.1600x1067.jpeg',
    stock: 50,
  },
  {
    title: 'Корзина плетёная Field',
    description:
      'Корзина из ивовой лозы с двумя ручками, диаметр 35 см. Для пледов, фруктов, зелени или журналов. Держит форму годами.',
    price: 1890,
    category: 'storage',
    imageHash: 'image_msk_5Pf1XEQYrX.1600x1035.jpeg',
    stock: 22,
    featured: true,
  },
  {
    title: 'Органайзер для столовых приборов',
    description:
      'Бамбуковый лоток с семью отделениями под ящик шириной 40–50 см. Раздвигается по ширине, не скользит по дну ящика.',
    price: 1290,
    oldPrice: 1590,
    category: 'storage',
    imageHash: 'image_msk_8rDSmTAxMa.1600x1068.jpeg',
    stock: 33,
  },
  {
    title: 'Набор банок Glass, 6 шт.',
    description:
      'Стеклянные банки с герметичными крышками объёмом 500 мл. Для круп, кофе, специй и заготовок. Можно мыть в посудомоечной машине.',
    price: 1790,
    category: 'storage',
    imageHash: 'image_msk_1AAzSZzpuQ.1600x1067.jpeg',
    stock: 46,
  },
  {
    title: 'Полка-вешалка Loft с банками',
    description:
      'Деревянная планка 60 см с четырьмя крючками и тремя подвесными банками для трав, кистей или мелочей. Крепёж в комплекте.',
    price: 2490,
    category: 'storage',
    imageHash: 'image_msk_sdq9vRp4Z4.1600x1068.jpeg',
    stock: 17,
  },
  {
    title: 'Поднос Nordic, серый',
    description:
      'Деревянный поднос 40×28 см с бортиками и ручками, покрытие матовой краской. Для завтрака в постель, косметики или ключей у входа.',
    price: 1590,
    category: 'storage',
    imageHash: 'image_msk_yDw2X6IXNZ.1600x1067.jpeg',
    stock: 28,
  },
]
