// TODO: query a real API

const images = [
  { url: 'https://images.unsplash.com/photo-1461016951828-c09537329b3a?fm=jpg', tags: ['field', 'landscape', 'sunlight'] },
  { url: 'https://images.unsplash.com/photo-1461295025362-7547f63dbaea?fm=jpg', tags: ['crops'] },
  { url: 'https://images.unsplash.com/photo-1465326117523-6450112b60b2?fm=jpg', tags: ['forest', 'hill'] },
  { url: 'https://images.unsplash.com/photo-1458640904116-093b74971de9?fm=jpg', tags: ['dark', 'field'] },
  //{ url: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?fm=jpg' },
  //{ url: 'https://images.unsplash.com/photo-1451906278231-17b8ff0a8880?fm=jpg' },
  // { url: 'https://images.unsplash.com/photo-1447969025943-8219c41ea47a?fm=jpg', tags: ['cat', 'kitten'] },
  // { url: 'https://images.unsplash.com/photo-1421749810611-438cc492b581?fm=jpg', tags: ['water', 'landscape'] },
  // { url: 'https://images.unsplash.com/photo-1449960238630-7e720e630019?fm=jpg', tags: ['water', 'seaside'] },
  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['water', 'cliff'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['field', 'stack'] }
];

export const getPopularImages = () => Promise.resolve(images);

export const searchImages = (query) => {
  const filteredImages = images.filter(img => {
    return img.tags.some(tag => {
      return tag.indexOf(query) !== -1;
    });
  });
  return Promise.resolve(filteredImages);
};


// TODO: query a real API

const backgrounds = [
  // { url: 'https://images.unsplash.com/photo-1461016951828-c09537329b3a?fm=jpg', tags: ['field', 'landscape', 'sunlight'] },
  // { url: 'https://images.unsplash.com/photo-1461295025362-7547f63dbaea?fm=jpg', tags: ['crops'] },
  // { url: 'https://images.unsplash.com/photo-1465326117523-6450112b60b2?fm=jpg', tags: ['forest', 'hill'] },
  // { url: 'https://images.unsplash.com/photo-1458640904116-093b74971de9?fm=jpg', tags: ['dark', 'field'] },
  // //{ url: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?fm=jpg' },
  // //{ url: 'https://images.unsplash.com/photo-1451906278231-17b8ff0a8880?fm=jpg' },
  // { url: 'https://images.unsplash.com/photo-1447969025943-8219c41ea47a?fm=jpg', tags: ['cat', 'kitten'] },
  // { url: 'https://images.unsplash.com/photo-1421749810611-438cc492b581?fm=jpg', tags: ['water', 'landscape'] },
  // { url: 'https://images.unsplash.com/photo-1449960238630-7e720e630019?fm=jpg', tags: ['water', 'seaside'] },
  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['water', 'cliff'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['field', 'stack'] },

  // { url: 'https://www.planwallpaper.com/static/cache/6f/ea/6fea69114181ba371978240d7e73100e.jpg', tags: ['field', 'landscape', 'sunlight'] },
  // { url: 'https://www.planwallpaper.com/static/images/120_Circle-Blue-Background-Vector-Graphic.png', tags: ['crops'] },
  // { url: 'https://www.planwallpaper.com/static/images/AbstractDesignVectorBackground.jpg', tags: ['forest', 'hill'] },
  // { url: 'https://www.planwallpaper.com/static/images/7013470-design-vector-background.jpg', tags: ['dark', 'field'] },
  // //{ url: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?fm=jpg' },
  // //{ url: 'https://images.unsplash.com/photo-1451906278231-17b8ff0a8880?fm=jpg' },
  // { url: 'https://www.planwallpaper.com/static/images/abstract-splash-swoosh-background-design_21-5027776.jpg', tags: ['cat', 'kitten'] },
  // { url: 'https://www.planwallpaper.com/static/images/Abstract-Background-Design-High-Definition-Wallpaper_tDEK7A7.jpg', tags: ['water', 'landscape'] },
  // { url: 'https://www.planwallpaper.com/static/images/background-design-10-Best-Wallpaper.jpg', tags: ['water', 'seaside'] },
  // { url: 'https://www.planwallpaper.com/static/images/background-design-14-Cool-Backgrounds.jpg', tags: ['water', 'cliff'] },
  // { url: 'https://www.planwallpaper.com/static/images/Background-Design-Images-10-HD-Screensavers-1024x768.jpg', tags: ['field', 'stack'] },

  // { url: 'https://www.planwallpaper.com/static/images/Background-Design-Images-34-HD-Images-Wallpapers-1024x768.jpg', tags: ['field', 'landscape', 'sunlight'] },
  // { url: 'https://www.planwallpaper.com/static/images/background-designs-13-2014-background-and-wallpaper.jpg', tags: ['crops'] },
  // { url: 'https://www.planwallpaper.com/static/images/floral_background_design_by_rjdezigns-d6l53mb.png', tags: ['forest', 'hill'] },
  // { url: 'https://www.planwallpaper.com/static/images/nice-background-design.jpg', tags: ['dark', 'field'] },
  // //{ url: 'https://images.unsplash.com/photo-1453227588063-bb302b62f50b?fm=jpg' },
  // //{ url: 'https://images.unsplash.com/photo-1451906278231-17b8ff0a8880?fm=jpg' },
  // { url: 'https://www.planwallpaper.com/static/images/Stunning-retro-graphic-powerpoint-design-background.jpg', tags: ['cat', 'kitten'] },
  

  // //NAture & flowers
  // { url: 'https://www.planwallpaper.com/static/images/1220647-flowers.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/6897816-purple-flowers.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/7031995-beautiful-shinny-flowers_wIoclOY.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/apple_flowers-wide.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/Beautiful-flower.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/Desktop_backgroud_and_wallpaer_for_flowers.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/flowers_eNmLmgp.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/flowers2.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/flowers-2_HzAW5xd.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/flowers3.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/flowers-3_gtieQwi.jpg', tags: ['flowers', 'nature'] },
  { url: 'https://www.planwallpaper.com/static/images/flowers-09.jpg', tags: ['flowers', 'nature'] },
  { url: 'https://www.planwallpaper.com/static/images/flowers-garden-colorful-colourful.jpg', tags: ['flowers', 'nature'] },
  { url: 'https://www.planwallpaper.com/static/images/Flowers-Photos-8-Cool-Wallpapers-HD_B3ydPmK.jpg', tags: ['flowers', 'nature'] },
  { url: 'https://www.planwallpaper.com/static/images/T46-1.jpg', tags: ['flowers', 'nature'] },
  { url: 'https://www.planwallpaper.com/static/images/Wild-Flowers-343x1781074-735717.png', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/wild-flowers-571940_640.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/125146_nature-flowers-1600x1200-wallpaper.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/7038353-flower-nature.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/beautiful-field-flowers-nature-pink-tulip-tulips-1920x1200.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/book_field_flowers_flying_sky_nature_mood_54429_1920x1200.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/Flower_Market_Flower_show_newflower890.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/desktop-nature-flower-wallpaper.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/nature_flowers_cats_animals_grass_kittens_1920x1200_wallpaper.jpg', tags: ['cat', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/Spring-Nature-Flowers-Landscapes-HQ-Wallpaper.jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://www.planwallpaper.com/static/images/persona-nature-flower-flowers-spring-summer-free-hd-117310.jpg', tags: ['flowers', 'nature'] },

  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/photo-1433190152045-5a94184895da?fm=jpg', tags: ['flowers', 'nature'] },
  // { url: 'https://images.unsplash.com/9/fields.jpg?ixlib=rb-0.3.5&q=80&fm=jpg', tags: ['flowers', 'nature'] }

];

export const loadBackgrounds = () => Promise.resolve(backgrounds);
