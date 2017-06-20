import { ComponentEx } from '../../../util/ComponentEx';
import Icon from '../../../views/Icon';
import { IconButton } from '../../../views/TooltipControls';

import * as React from 'react';

export interface IProps {
  gameId: string;
  modId: string;
  endorsedStatus: string;
  t: I18next.TranslationFunction;
  onEndorseMod: (gameId: string, modId: string, endorsedStatus) => void;
}

/**
 * Endorse Button
 *
 * @class EndorseModButton
 */
class EndorseModButton extends ComponentEx<IProps, {}> {
  public render(): JSX.Element {
    const {endorsedStatus, modId, t } = this.props;

    if (endorsedStatus === 'pending') {
      return (
        <div style={{ textAlign: 'center' }}>
          <Icon
            name='spinner'
            pulse
          />
        </div>
      );
    }

    const { icon, tooltip } = {
      Undecided: { icon: 'like-maybe', tooltip: t('Undecided') },
      Abstained: { icon: 'like-no', tooltip: t('Abstained') },
      Endorsed: { icon: 'like', tooltip: t('Endorsed') },
    }[endorsedStatus] || { icon: 'star-half-o', tooltip: t('Undecided') };

    return (
      <div style={{ textAlign: 'center' }}>
        <IconButton
          className='btn-embed'
          id={modId}
          tooltip={tooltip}
          icon={icon}
          onClick={this.endorseMod}
        />
      </div>
    );
  }

  private endorseMod = () => {
    const { endorsedStatus, gameId, modId, onEndorseMod } = this.props;
    onEndorseMod(gameId, modId, endorsedStatus);
  }
}

export default EndorseModButton;
