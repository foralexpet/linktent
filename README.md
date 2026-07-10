<p align="center">
  <img src="./assets/logo.png" alt="linktent logo - React Hover Intent & Predictive Link Prefetching" width="600" />


> Predict and prefetch React links *before* user hovers or clicks. Optimize web performance and UX by up to 90%.

![Version](https://img.shields.io/npm/v/linktent?style=flat-square&labelColor=black&color=white)
![License](https://img.shields.io/npm/l/linktent?style=flat-square&labelColor=black&color=white)
![Node Version](https://img.shields.io/node/v/linktent?style=flat-square&labelColor=black&color=white)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/linktent?style=flat-square&labelColor=black&color=white)
![GitHub Last Commit](https://img.shields.io/github/last-commit/foralexpet/linktent?style=flat-square&labelColor=black&color=white)
![NPM Last Update](https://img.shields.io/npm/last-update/linktent?style=flat-square&labelColor=black&color=white)


  <img src="./assets/showcase.gif" alt="linktent predictive hover intent prefetching simulation demo" width="600" />


`linktent` tracks real-time mouse velocity and trajectory vectors to intelligently anticipate which link a user is navigating towards. This allows it to initiate predictive preloading 100-300ms before hover or touch occurs, providing a zero-latency navigations experience without blindly prefetching every link in viewport.
</p>

---

## 🚀 Live Demo & Simulation

To see the trajectory calculation and predictive collision ray in action, you can run the interactive visualization locally:

```bash
# Start the local demo server
npm run demo
```
Then visit **http://localhost:3000** in your browser!

---

## 🛠️ How it works

Standard prefetching (like Next.js/Remix default link components) blindly prefetches everything on-screen, leading to massive database/API costs on scroll. Hover prefetching only gives the browser ~100ms before a click.

`linktent` tracks the mouse velocity vector:
$$\vec{v} = \left( \frac{\Delta x}{\Delta t}, \frac{\Delta y}{\Delta t} \right)$$

It projects a "collision ray" forward by 300ms. If the projected endpoint intersects with a link's bounding box, it triggers prefetching early.

## Installation

```bash
npm install linktent
# or
yarn add linktent
# or
pnpm add linktent
# or
bun add linktent
```

## Usage

### 1. Wrap your application with the provider

```tsx
import { IntentProvider } from 'linktent';

export default function App({ children }) {
  return (
    <IntentProvider>
      {children}
    </IntentProvider>
  );
}
```

### 2. Use `IntentLink` for predictive loading

```tsx
import { IntentLink } from 'linktent';
import { useQueryClient } from '@tanstack/react-query';

export const ProductCard = ({ id }) => {
  const queryClient = useQueryClient();

  return (
    <IntentLink
      href={`/product/${id}`}
      prefetchFn={() => queryClient.prefetchQuery(['product', id], fetchProduct)}
    >
      View Product
    </IntentLink>
  );
};
```

## License

MIT License - Copyright (c) foralexpet@gmail.com
