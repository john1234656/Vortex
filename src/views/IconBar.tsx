import { IIconDefinition } from '../types/IIconDefinition';
import { ComponentEx, extend, translate } from '../util/ComponentEx';
import { IExtensibleProps } from '../util/ExtensionProvider';
import ToolbarIcon from './ToolbarIcon';

import * as React from 'react';
import { ButtonGroup } from 'react-bootstrap';

export interface IBaseProps {
  className?: string;
  group: string;
  instanceId?: string;
}

export interface IExtensionProps {
  objects: IIconDefinition[];
}

type IProps = IBaseProps & IExtensionProps & React.HTMLAttributes;

/**
 * represents an extensible row of icons/buttons
 * In the simplest form this is simply a bunch of buttons that will run
 * an action if clicked, but an icon can also be more dynamic (i.e. rendering
 * dynamic content or having multiple states)
 * 
 * @class IconBar
 * @extends {ComponentEx<IProps, {}>}
 */
class IconBar extends ComponentEx<IProps, {}> {

  public render(): JSX.Element {

    const { objects, className, style } = this.props;

    return (
      <ButtonGroup className={className} style={style} >
        { objects.map(this.renderIcon) }
      </ButtonGroup>
    );
  }

  private renderIcon = (icon: IIconDefinition) => this.renderIconImpl(icon);

  private renderIconImpl(icon: IIconDefinition) {
    const { t, instanceId } = this.props;
    // don't render anything if the condition doesn't match
    if ((icon.condition !== undefined) && !icon.condition(instanceId)) {
      return null;
    }

    if (icon.icon !== undefined) {
      let id = `${instanceId || '1'}_${icon.title}`;

      // simple case
      return <ToolbarIcon
        key={id}
        id={id}
        icon={icon.icon}
        tooltip={t(icon.title)}
        onClick={icon.action}
      />;
    } else {
      // custom case. the caller can pass properties via the props() function and by
      // passing the prop to the iconbar. the props on the iconbar that we don't handle are
      // passed on
      const knownProps = [ 'condition', 'className', 'group', 't', 'i18nLoadedAt',
                           'instanceId', 'objects', 'children' ];
      const unknownProps = Object.keys(this.props).reduce((prev: any, current: string) => {
        if (knownProps.indexOf(current) === -1) {
          return Object.assign({}, prev, { [current]: this.props[current] });
        } else {
          return prev;
        }
      }, {});
      const props = Object.assign({},
        unknownProps,
        icon.props !== undefined ? icon.props() : {}
      );
      return <icon.component {...props} />;
    }
  }
}

/**
 * called to register an extension icon. Please note that this function is called once for every
 * icon bar in the ui for each icon. Only the bar with matching group name should accept the icon
 * by returning a descriptor object.
 * 
 * @param {IconBar} instance the bar to test against. Please note that this is not actually an
 *                           IconBar instance but the Wrapper, as the bar itself is not yet
 *                           registered, but all props are there
 * @param {string} group name of the icon group this icon wants to be registered with
 * @param {string} icon name of the icon to use
 * @param {string} title title of the icon
 * @param {*} action the action to call on click
 * @returns
 */
function registerIcon(instance: IconBar,
                      group: string,
                      iconOrComponent: string | React.ComponentClass<any>,
                      titleOrProps: string | Function,
                      actionOrCondition?: () => void | boolean,
                      condition?: () => boolean): Object {
  if (instance.props.group === group) {
    if (typeof(iconOrComponent) === 'string') {
      return { type: 'simple', icon: iconOrComponent, title: titleOrProps,
               action: actionOrCondition, condition };
    } else {
      return { type: 'ext', component: iconOrComponent, props: titleOrProps,
               condition: actionOrCondition };
    }
  } else {
    return undefined;
  }
}

export default
  translate(['common'], { wait: false })(
    extend(registerIcon)(IconBar)
  ) as React.ComponentClass<IBaseProps & IExtensibleProps & React.HTMLAttributes>;
