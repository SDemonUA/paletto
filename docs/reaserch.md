## Analizyng different color themes on how they select colors

| Theme                | Is it dark? | Primary Color | Secondary Color | Text Color          | Text Secondary Color     | Background Color |
| -------------------- | ----------- | ------------- | --------------- | ------------------- | ------------------------ | ---------------- |
| MUI Default Light    | No          | #1976d2       | #9c27b0         | rgba(0, 0, 0, 0.87) | rgba(0, 0, 0, 0.6)       | #ffffff          |
| MUI Default Dark     | Yes         | #90caf9       | #ce93d8         | #fff                | rgba(255, 255, 255, 0.7) | #121212          |
| ShadCN/UI Zink Light | No          | #353535       | #f7f7f7         | #242424             | #8d8d8d                  | #ffffff          |
| ShadCN/UI Zink Dark  | Yes         | #eaeaea       | #464646         | #fbfbfb             | #b3b3b3                  | #242424          |
| ShadCN/UI Blue Light | No          | #6e56cf       | #f7f7f7         | #222222             | #8d8d8d                  | #ffffff          |
| ShadCN/UI Blue Dark  | Yes         | #5a4fcf       | #444444         | #fafafa             | #b3b3b3                  | #222222          |

## Conclusions

**Primary and Secondary Colors Relationships:**

- In light themes, the Primary Color is typically vibrant and contrasts well with the Background Color, which is usually white.
- In dark themes, the Primary Color is often less vibrant to avoid excessive contrast with the dark background.
- The Secondary Color is commonly used for accents and typically complements the Primary Color harmoniously.

**Mathematical/Algorithmic Relationships:**

- Primary to Secondary Color in light themes: Secondary often maintains similar saturation but shifts hue by 60-180 degrees on the color wheel.
- Dark theme Primary Color ≈ Light theme Primary Color with increased luminosity (10-30% brighter)
- Contrast ratio between Primary and Background: 4.5:1 minimum (for accessibility)

**Primary, Background, and Text Colors Relationships:**

- Text Color in light themes is dark, while in dark themes it's light, ensuring readability against the background.
- There's a consistent inverse relationship between background and text colors to maintain readability.

**Mathematical/Algorithmic Relationships:**

- Text Color ≈ inverse of Background Color (in HSL, L value inverted)
- For light themes: Text Color luminosity ≤ 20%
- For dark themes: Text Color luminosity ≥ 80%
- Primary-Text contrast ratio should be at least 3:1 for non-text elements

**Background, Text, and Secondary Text Colors Relationships:**

- The Text Secondary Color is always less contrastive than the main Text Color, indicating less important text.
- Background Color is white in light themes and dark in dark themes to match the overall theme atmosphere.
- Color opacity is often used for secondary text to create visual hierarchy without introducing new colors.

**Mathematical/Algorithmic Relationships:**

- Secondary Text Color ≈ Primary Text Color with reduced opacity (60-70% opacity)
- Alternative: Secondary Text Color ≈ Primary Text Color with luminosity shifted 15-30% toward Background Color
- Contrast ratio between Background and Secondary Text: minimum 3:1 (for accessibility)

## Color Palette Algorithm

```pseudo
function generateColorPalette(primaryColor, isDarkTheme):
    // 1. Визначення фону на основі типу теми
    if isDarkTheme:
        backgroundColor = темний_відтінок_з_нахилом_до_primary
    else:
        backgroundColor = білий

    // 2. Коригування первинного кольору для кращої видимості
    if isDarkTheme:
        primaryColor = зробити_яскравішим(primaryColor)
    else:
        primaryColor = забезпечити_контраст_з_білим(primaryColor)

    // 3. Створення вторинного кольору
    // Варіанти: комплементарний, тріадний, аналоговий
    secondaryColor = зсув_відтінку(primaryColor)

    // 4. Визначення текстових кольорів
    if isDarkTheme:
        textColor = світлий
        textSecondaryColor = менш_світлий_ніж_основний_текст
    else:
        textColor = темний
        textSecondaryColor = менш_темний_ніж_основний_текст

    // 5. Перевірка та забезпечення доступності (контрасту)
    перевірити_та_виправити_контраст([
        [backgroundColor, primaryColor],
        [backgroundColor, secondaryColor],
        [backgroundColor, textColor],
        [backgroundColor, textSecondaryColor]
    ])

    // 6. Генерація додаткових функціональних кольорів
    errorColor = червоний_з_урахуванням_теми
    warningColor = помаранчевий_з_урахуванням_теми
    successColor = зелений_з_урахуванням_теми

    return обʼєкт_з_усіма_кольорами
```
