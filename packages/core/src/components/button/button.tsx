import { Component, Element, Prop } from '@stencil/core';
import { getElementClassObject } from '../../utils/theme';


@Component({
  tag: 'ion-button',
  styleUrls: {
    ios: 'button.ios.scss',
    md: 'button.md.scss'
  }
})
export class Button {
  @Element() private el: HTMLElement;

  @Prop() itemButton: boolean = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * The type of button.
   * Possible values are: `"button"`, `"bar-button"`.
   */
  @Prop() buttonType: string = 'button';

  /**
   * The button size.
   * Possible values are: `"small"`, `"large"`.
   */
  @Prop() size: 'small' | 'large';

  /**
   * If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * `ion-navbar`, where the default is `"clear"`.
   */
  @Prop() fill: 'clear' | 'outline' | 'solid' | 'default' = 'default';

  /**
   * If true, activates a button with rounded corners.
   * Type: shape
   */
  @Prop() round: boolean = false;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop() expand: 'full' | 'block';

  /**
   * If true, activates a button with a heavier font weight.
   * Type: decorator
   */
  @Prop() strong: boolean = false;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  protected render() {

    const {
      buttonType,
      itemButton,
      color,
      expand,
      fill,
      mode,
      round,
      size,
      strong
    } = this;

    const elementClasses: string[] = []
      .concat(
        getButtonClassList(buttonType, mode),
        getClassList(buttonType, expand, mode),
        getClassList(buttonType, size, mode),
        getClassList(buttonType, round ? 'round' : null, mode),
        getClassList(buttonType, strong ? 'strong' : null, mode),
        getColorClassList(buttonType, color, fill, mode),
        getItemClassList(itemButton, size)
      );

    const TagType = this.href ? 'a' : 'button';

    const buttonClasses = {
      ...getElementClassObject(this.el.classList),
      ...getElementClassObject(elementClasses)
    };

    return (
      <TagType class={buttonClasses} disabled={this.disabled} href={this.href}>
        <span class='button-inner'>
          <slot name='icon-only'></slot>
          <slot name='start'></slot>
          <slot></slot>
          <slot name='end'></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}

/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
function getButtonClassList(buttonType: string, mode: string): string[] {
  if (!buttonType) {
    return [];
  }
  return [
    buttonType,
    `${buttonType}-${mode}`
  ];
}


/**
 * Get the classes based on the type
 * e.g. block, full, round, large
 */
function getClassList(buttonType: string, type: string, mode: string): string[] {
  if (!type) {
    return [];
  }
  type = type.toLocaleLowerCase();
  return [
    `${buttonType}-${type}`,
    `${buttonType}-${type}-${mode}`
  ];
}

function getColorClassList(buttonType: string, color: string, fill: string, mode: string): string[] {
  let className = buttonType;

  if (buttonType !== 'bar-button' && fill === 'solid') {
    fill = 'default';
  }

  if (fill && fill !== 'default') {
    className += `-${fill.toLowerCase()}`;
  }

  // special case for a default bar button
  // if the bar button is default it should get the fill
  // but if a color is passed the fill shouldn't be added
  if (buttonType === 'bar-button' && fill === 'default') {
    className = buttonType;
    if (!color) {
      className += '-' + fill.toLowerCase();
    }
  }

  return [`${className}-${mode}`].concat(
      fill !== 'default' ? `${className}` : [],
      color ? `${className}-${mode}-${color}` : []
    );
}

function getItemClassList(itemButton: boolean, size: string) {
  return itemButton && !size ? ['item-button'] : [];
}
