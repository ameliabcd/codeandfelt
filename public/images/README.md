# How to Add Your Own Images

## Steps:

1. **Add your images to this folder:**
   - Put your images in the `public/images/hero/` folder
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
   - Recommended size: 600x600px or larger (square images work best)

2. **Update the image list:**
   - Open `components/Home/HeroSection.jsx`
   - Find the `DEMO_IMAGES` array
   - Replace the `url` values with paths like: `/images/hero/your-image.jpg`
   - Update the `name` to describe your image

## Example:

If you add a file called `my-artwork.jpg` to `public/images/hero/`, use:
```javascript
{
  id: 'my-art-1',
  url: '/images/hero/my-artwork.jpg',
  name: 'My Artwork'
}
```

## Tips:

- Use descriptive filenames (e.g., `fiber-art-1.jpg` instead of `IMG_1234.jpg`)
- Keep images optimized (under 500KB each for faster loading)
- Square images (1:1 aspect ratio) look best
- You can add as many images as you want!

