# How Manual Entry Data Determines Pattern Generation

## Overview
When you enter values manually, they flow through a transformation pipeline that converts your raw numbers into visual pattern parameters.

## Step-by-Step Flow

### 1. **Data Parsing** (`ManualDataEntry.jsx`)
Your input values are parsed based on the format you choose:
- **Single Column**: Each row becomes one value → `[[value1], [value2], ...]`
- **Multiple Values**: Each row split by delimiter → `[[v1, v2, v3], [v4, v5, v6], ...]`
- **Table**: First row = headers, rest = data → `{headers: [...], data: [[...], [...]]}`

### 2. **Data Normalization** (`lib/dataParser.js`)
Your raw numbers are normalized to a 0-1 range:
```javascript
// Example: [10, 20, 30, 40] → [0, 0.33, 0.67, 1.0]
normalizeData(numericData)
```

### 3. **Column Averages Calculation**
For each column, the system calculates the average of all normalized values:
```javascript
// Example: Column 1: [0.2, 0.4, 0.6] → average = 0.4
// Example: Column 2: [0.1, 0.3, 0.5] → average = 0.3
columnAverages = [0.4, 0.3, ...]
```

### 4. **Fractal Parameters Mapping** (`dataToFractalParams`)
Column averages are mapped to fractal generation parameters:

| Column | Parameter | How It's Used |
|--------|-----------|---------------|
| **Column 1 Average** | `zoom` | Controls how zoomed in the fractal is (0.5 to 3.0x) |
| **Column 2 Average** | `offsetX` | Horizontal position shift (-1.5 to 1.5) |
| **Column 3 Average** | `offsetY` | Vertical position shift (-1.5 to 1.5) |
| **Column 4 Average** | `maxIterations` | Detail level (100 to 200 iterations) |
| **Column 1 + 2** | `juliaReal`, `juliaImag` | Julia set constant values |
| **All Values** | `variability` | Standard deviation (affects pattern complexity) |

**Example:**
- Input: `[22, 24, 26, 28, 30]` (single column)
- Normalized: `[0.0, 0.25, 0.5, 0.75, 1.0]`
- Column 1 Average: `0.5`
- Result: `zoom = 0.5 + 0.5 * 2.5 = 1.75x`

### 5. **Geometric Pattern Parameters** (`dataToPatternParams`)
For geometric patterns, data maps differently:

| Parameter | Uses Column | Effect |
|-----------|-------------|--------|
| `gradientAngle` | Column 1 | Direction of gradient (0°, 45°, 90°, etc.) |
| `gradientIntensity` | Column 2 | Strength of gradient (0.8 to 1.2) |
| `spiralFrequency` | Column 1 | How tight the spiral is (2 to 8) |
| `spiralAmplitude` | Column 2 | Wave height (0.7 to 1.3) |
| `stripeWidth` | Column 1 | Width of stripes (3 to 10 pixels) |
| `stripeAngle` | Column 2 | Stripe direction (0° to 180°) |
| `checkBlockSize` | Column 1 | Checkerboard square size (3 to 10) |

### 6. **Color Generation** (`generateDataColors`)
Colors are generated from your data values:

- **Base Hue**: Uses Column 1 average (0-360° color wheel)
- **Hue Spread**: Uses variability (more varied data = more color spread)
- **Saturation**: Alternates between 80-95% based on column averages
- **Lightness**: Alternates between 50-60% based on column averages

**Example:**
- Column 1 Average: `0.4` → Base Hue: `0.4 * 360 = 144°` (green)
- Variability: `0.3` → Hue Spread: `70 + 0.3 * 120 = 106°`
- Result: Colors spread from green to cyan to blue

### 7. **Pattern Generation** (`DataPatternGenerator.jsx`)
Finally, the chosen pattern type uses these parameters:

**For Fractals:**
```javascript
generateMandelbrot(
  width, height,
  maxIterations,  // From Column 4
  zoom,           // From Column 1
  offsetX,        // From Column 2
  offsetY         // From Column 3
)
```

**For Geometric Patterns:**
```javascript
generateGradient(size, {
  angle: gradientAngle,        // From Column 1
  intensity: gradientIntensity, // From Column 2
  offset: gradientOffset        // From Column 3
})
```

## Example: Birthday Data

**Input:** `3, 15, 2000` (month, day, year)

1. **Parsed:** `[[3], [15], [2000]]`
2. **Normalized:** `[0.0, 0.006, 1.0]` (assuming min=3, max=2000)
3. **Column 1 Average:** `0.335`
4. **Fractal Parameters:**
   - `zoom = 0.5 + 0.335 * 2.5 = 1.34x`
   - `maxIterations = 100 + 0.335 * 100 = 133`
5. **Colors:** Base hue around 120° (greenish)
6. **Result:** A Mandelbrot fractal zoomed at 1.34x with 133 iterations, green-tinted colors

## Example: Exercise Data

**Input:** 
```
8523, 4.2, 312
12345, 5.1, 450
9876, 3.8, 280
```

1. **Parsed:** `[[8523, 4.2, 312], [12345, 5.1, 450], [9876, 3.8, 280]]`
2. **Normalized:** Each column normalized separately
3. **Column Averages:** `[0.5, 0.5, 0.5]` (example)
4. **Fractal Parameters:**
   - `zoom = 1.75x` (from Column 1)
   - `offsetX = 0` (from Column 2)
   - `offsetY = 0` (from Column 3)
   - `maxIterations = 150` (from Column 4, or default)
5. **Colors:** Based on all three columns, creating a diverse palette
6. **Result:** A fractal with specific zoom and position, multi-colored

## Key Insight

**Different data values = Different column averages = Different pattern parameters = Different visual output**

Even small changes in your input values will:
- Change the zoom level (closer/farther view)
- Shift the pattern position
- Alter the color palette
- Adjust pattern complexity
- Modify geometric pattern angles, sizes, and frequencies

This is why each unique dataset produces a unique pattern!

