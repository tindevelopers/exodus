# Exodus Theme — Settings Audit

Dawn's `config/settings_schema.json` defines global theme settings. **Preserve these groups** when customizing. Extend by adding new groups, not removing existing ones.

## Existing Setting Groups (Do Not Remove)

| Group | Key settings | Usage |
|-------|--------------|--------|
| **theme_info** | theme_name, theme_version | Metadata (updated to Exodus) |
| **Logo** | logo, logo_width, favicon | Header branding |
| **Colors** | color_schemes (background, text, button, etc.) | Use `settings.color_schemes` / `color_scheme` in sections |
| **Typography** | type_header_font, type_body_font, heading_scale, body_scale | Fonts and scale |
| **Layout** | page_width, spacing_sections, spacing_grid_* | Page and grid spacing |
| **Animations** | animations_reveal_on_scroll, animations_hover_elements | Reveal and hover effects |
| **Buttons** | buttons_border_*, buttons_radius, buttons_shadow_* | Button styling |
| **Variant pills** | variant_pills_border_*, variant_pills_radius | Product variant selectors |
| **Inputs** | inputs_border_*, inputs_radius | Form fields |
| **Cards** | card_style, card_image_padding, card_text_alignment, card_color_scheme, etc. | Product cards |
| **Collection cards** | collection_card_* | Collection grid cards |
| **Blog cards** | blog_card_* | Blog post cards |
| **Content containers** | text_boxes_* | Rich text, image-with-text sections |
| **Media** | media_border_*, media_radius | Images, videos |
| **Popups** | popup_* | Modal popups |
| **Drawers** | drawer_* | Cart drawer, etc. |
| **Badges** | badge_position, badge_corner_radius, sale_badge_color_scheme | Product badges |
| **Brand information** | brand_headline, brand_description, brand_image | About / brand content |
| **Social media** | social_facebook_link, social_instagram_link, etc. | Footer links |
| **Search input** | predictive_search_enabled, predictive_search_show_* | Search behavior |
| **Currency format** | currency_code_enabled | Price display |
| **Cart** | cart_type, show_vendor, show_cart_note, cart_drawer_collection | Cart behavior and styling |

## Extending for Custom Design

When adding custom sections from Figma/Builder.io:

1. **Use existing settings** where possible: reference `settings.type_header_font`, `settings.color_schemes`, `settings.spacing_sections`, etc.
2. **Add section-level settings** in each section's `{% schema %}` for layout, content, and section-specific options.
3. **Add new global groups** only for design tokens used across many custom sections (e.g. custom accent color, custom spacing scale).
4. **Add translation keys** to `locales/en.default.json` and `locales/en.default.schema.json` for new labels.

## Example: Custom Section Using Global Settings

```liquid
<div class="my-custom-section color-{{ section.settings.color_scheme }}" style="padding: {{ settings.spacing_sections }}px 0;">
  <h2 class="heading" style="font-family: {{ settings.type_header_font.family }};">
    {{ section.settings.heading }}
  </h2>
</div>

{% schema %}
{
  "name": "Custom Section",
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Color scheme",
      "default": "scheme-1"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Welcome"
    }
  ]
}
{% endschema %}
```
