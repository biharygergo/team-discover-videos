import React, { Fragment, PureComponent } from 'react';

export type ExactBranch = (condition: any) => any;
export type Branch = () => any;

export type IfProps = {
  condition?: any;
  then?: ExactBranch;
  else?: Branch;
};

export default class If extends PureComponent<IfProps> {
  static defaultProps = {
    then: null,
    else: null,
  };

  render(): React.ReactElement {
    /* eslint-disable react/destructuring-assignment */
    return (
      <Fragment>
        {this.props.condition && this.props.then && this.props.then(this.props.condition)}
        {!this.props.condition && this.props.else && this.props.else()}
      </Fragment>
    );
  }
}
