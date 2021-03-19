import React = require("react");
import { NumberDisplay } from "./NumberDisplay";

interface ServoDisplayProps {
  servoNumber: number;
  servoPosition: number;
}

type Props = ServoDisplayProps;

export class ServoDisplay extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <section style={{ textAlign: 'center' }}>
        <h3>Servo {this.props.servoNumber}</h3>
        <div><NumberDisplay value={Math.round(this.props.servoPosition)} readOnly width={4} /></div>
      </section>
    );
  }
}