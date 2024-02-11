# Hyperspace Jump
https://kartofelek007.github.io/hyperspace/

### How to use
1. get canvas
2. create hyperspace instance
3. enjoy :)
```js
const canvas = document.createElement("canvas");
const box = canvas.parentElement.getBoundingClientRect();
canvas.width = box.width;
canvas.height = box.height;

const hyper = new Hyperspace(canvas, {
    speedChange : 0.003,
    quantity : 200,
    minSpeed : 1,
    bgColor: "rgb(3,18,41)",
    bgColorHyperspace: "rgb(3,18,41, 0.3)"
});

document.addEventListener("mousedown", () => {
	hyper.startHyperspace();
})

document.addEventListener("mouseup", e => {
    hyper.stopHyperspace();
})
```

### Parameters
**quantity** - default `600` - number of stars
**maxSpeed** - default `20` - max speed in hyperspace
**minSpeed** - default `1` - min speed 
**speedChange** - `0.001` - speed of acceleration and deceleration
**bgColor** - default `#000` background color
**bgColorHyperspace** - default `rgba(0,0,0,0.1)` - backgorund color for hyperspace. Less alpha - star will be longer
**starColor** : default `rgba(255,255,255,1)` - color of stars

### Methods
**startHyperspace()** - start jump
**stopHyperspace()** - end jump
