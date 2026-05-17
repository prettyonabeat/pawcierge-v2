# PawCierge V2

A premium dark landing page for a small-breed puppy matching and delivery concierge service. The project uses HTML, CSS, and vanilla JavaScript with no build step.

## How to open the site locally

1. Open `index.html` in your browser.
2. If you want a local server, run this from the project folder:

```bash
npx serve .
```

Then open the address shown in the terminal.

## How to add a new puppy

1. Add the photo to `images/puppies/`.
2. Open `data/puppies.js`.
3. Add a new object to the `window.PAWCIERGE_PUPPIES` array:

```js
{
  name: "Name",
  breed: "Breed",
  age: "Age",
  gender: "Gender",
  price: "Price",
  status: "Available",
  image: "images/puppies/photo-name.jpg"
}
```

The card will appear on the site automatically.

## How to replace client photos

1. Place new images in `images/clients/`.
2. In `index.html`, find the `Client reviews` section.
3. Replace the `src` values in the review images with your new file paths.

## How to deploy on Vercel

1. Upload the project to a GitHub repository.
2. In Vercel, click `Add New Project`.
3. Select the PawCierge repository.
4. Leave Framework Preset as `Other`.
5. Leave Build Command empty.
6. Leave Output Directory empty or set it to `.`.
7. Click `Deploy`.
