import { useApp } from '../context/AppContext';

export function DynamicStyles() {
    const { siteSettings } = useApp();
    const overrides = siteSettings.homepageSections || {};

    const generateCss = () => {
        let css = '';

        Object.entries(overrides).forEach(([id, styles]: [string, any]) => {
            let rules = '';
            if (styles.fontFamily) rules += `font-family: "${styles.fontFamily}", sans-serif !important;`;
            if (styles.fontSize) rules += `font-size: ${styles.fontSize} !important;`;
            if (styles.lineHeight) rules += `line-height: ${styles.lineHeight} !important;`;
            if (styles.fontWeight) rules += `font-weight: ${styles.fontWeight} !important;`;
            if (styles.letterSpacing) rules += `letter-spacing: ${styles.letterSpacing} !important;`;
            if (styles.textTransform) rules += `text-transform: ${styles.textTransform} !important;`;
            if (styles.textAlign) rules += `text-align: ${styles.textAlign} !important;`;
            if (styles.color) rules += `color: ${styles.color} !important;`;

            if (styles.paddingTop) rules += `padding-top: ${styles.paddingTop} !important;`;
            if (styles.paddingBottom) rules += `padding-bottom: ${styles.paddingBottom} !important;`;
            if (styles.paddingLeft) rules += `padding-left: ${styles.paddingLeft} !important;`;
            if (styles.paddingRight) rules += `padding-right: ${styles.paddingRight} !important;`;

            if (styles.marginTop) rules += `margin-top: ${styles.marginTop} !important;`;
            if (styles.marginBottom) rules += `margin-bottom: ${styles.marginBottom} !important;`;

            if (styles.backgroundColor) rules += `background-color: ${styles.backgroundColor} !important;`;
            if (styles.backgroundImage) rules += `background-image: url(${styles.backgroundImage}) !important; background-size: cover !important; background-position: center !important;`;
            if (styles.backgroundGradient) rules += `background: ${styles.backgroundGradient} !important;`;

            if (styles.borderRadius) rules += `border-radius: ${styles.borderRadius} !important;`;
            if (styles.borderWidth) rules += `border-width: ${styles.borderWidth} !important; border-style: ${styles.borderStyle || 'solid'} !important; border-color: ${styles.borderColor || 'transparent'} !important;`;

            if (styles.width) rules += `width: ${styles.width} !important;`;
            if (styles.maxWidth) rules += `max-width: ${styles.maxWidth} !important;`;
            if (styles.minHeight) rules += `min-height: ${styles.minHeight} !important;`;
            if (styles.opacity) rules += `opacity: ${styles.opacity} !important;`;
            if (styles.boxShadow) rules += `box-shadow: ${styles.boxShadow} !important;`;

            let hoverRules = '';
            if (styles.hoverEffect && styles.hoverEffect !== 'none') {
                if (styles.hoverEffect === 'lift') hoverRules = 'transform: translateY(-6px) !important; transition: all 0.3s ease !important;';
                if (styles.hoverEffect === 'glow') hoverRules = 'box-shadow: 0 10px 30px -5px rgba(245, 158, 11, 0.4) !important; transition: all 0.3s ease !important;';
                if (styles.hoverEffect === 'scale') hoverRules = 'transform: scale(1.03) !important; transition: all 0.3s ease !important;';
                if (styles.hoverEffect === 'darken') hoverRules = 'filter: brightness(0.8) !important; transition: all 0.3s ease !important;';
            }

            if (rules) {
                // If the ID looks like a selector (has spaces, brackets, or multiple dots/hashes), use it as is
                // Otherwise try matching by data-editor-id, class, or id
                if (id.includes(' ') || id.includes('>') || id.includes('[') || id.includes(':')) {
                    css += ` ${id} { ${rules} } `;
                    if (hoverRules) css += ` ${id}:hover { ${hoverRules} } `;
                } else {
                    const selector = `
            [data-editor-id="${id}"],
            .${id.replace(/[^a-zA-Z0-9-]/g, '\\$&')},
            #${id.replace(/[^a-zA-Z0-9-]/g, '\\$&')},
            ${id}
          `;
                    css += ` ${selector} { ${rules} } `;
                    if (hoverRules) css += ` ${selector.split(',').map(s => s.trim() + ':hover').join(',')} { ${hoverRules} } `;
                }
            }
        });

        return css;
    };

    return (
        <style id="brm-dynamic-styles">
            {generateCss()}
        </style>
    );
}
