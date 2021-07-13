import * as React from 'react';

import * as Sim from '../Sim';
import { RobotState } from "../RobotState";
import { SurfaceState } from '../SurfaceState';

import { styled } from 'styletron-react';

import {
  Items,
} from '../items';
import resizeListener, { ResizeListener } from './ResizeListener';
import { Vector2 } from '../math';

export interface SimulatorAreaProps {
  robotState: RobotState;
  itemEnabled: boolean[];
  shouldSetRobotPosition: boolean;
  isSensorNoiseEnabled: boolean;
  surfaceState: SurfaceState;

  onRobotStateUpdate: (robotState: Partial<RobotState>) => void;
  // onRobotPositionSetCompleted: () => void;
}

const Container = styled('div', {
  flex: '1 1',
  position: 'relative',
  overflow: 'hidden'
});

const Canvas = styled('canvas', {
  position: 'absolute',
  ':focus': {
    outline: 'none'
  }
});

export class SimulatorArea extends React.Component<SimulatorAreaProps> {
  private containerRef_: HTMLDivElement;
  private canvasRef_: HTMLCanvasElement;

  space: Sim.Space;
  private oldIsSensorNoiseEnabled: boolean;
  
  constructor(props: SimulatorAreaProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.space = new Sim.Space(this.canvasRef_, () => this.props.robotState, (robotState) => {
      this.props.onRobotStateUpdate(robotState);
    });
    
    this.space.createScene();
    this.space.loadMeshes().then(() => {
      this.space.startRenderLoop();
    })
      .catch((e) => {
        console.error('The simulator meshes failed to load', e);
      });
  }

  private lastWidth_ = 0;
  private lastHeight_ = 0;

  private defaultItemList = Object.keys(Items);

  private onSizeChange_ = (size: Vector2) => {
    if (this.lastHeight_ !== size.y || this.lastWidth_ !== size.x) {
      this.canvasRef_.style.width = `${size.x}px`;
      this.canvasRef_.style.height = `${size.y}px`;
      this.space.handleResize();
    }
    
    this.lastWidth_ = size.x;
    this.lastHeight_ = size.y;
  };

  private resizeListener_ = resizeListener(this.onSizeChange_);


  componentWillUnmount() {
    this.resizeListener_.disconnect();
  }

  componentDidUpdate(prevProps: SimulatorAreaProps) {
    // Check if any cans were toggled
    this.props.itemEnabled.forEach((enabled, i) => {
      if (enabled === prevProps.itemEnabled[i]) return;
      this.setItemEnabled(this.defaultItemList[i], enabled);
    });
    
    // Check if simulation settings were changed
    if (this.props.isSensorNoiseEnabled !== this.oldIsSensorNoiseEnabled) {
      this.oldIsSensorNoiseEnabled = this.props.isSensorNoiseEnabled;
      this.space.updateSensorOptions(this.props.isSensorNoiseEnabled);
    }

    // Check if board was reset
    if (this.props.surfaceState !== prevProps.surfaceState) {
      this.space.rebuildFloor(this.props.surfaceState);
      this.space.resetPosition();
    }

    const shouldSetRobotPosition = (
      prevProps.robotState.x !== this.props.robotState.x ||
      prevProps.robotState.y !== this.props.robotState.y ||
      prevProps.robotState.z !== this.props.robotState.z ||
      prevProps.robotState.theta !== this.props.robotState.theta
    );

    // Checks if robot position needs to be set
    if (shouldSetRobotPosition) this.space.resetPosition();
  }

  private bindContainerRef_ = (ref: HTMLDivElement) => {
    if (this.containerRef_) this.resizeListener_.unobserve(this.containerRef_);
    this.containerRef_ = ref;
    if (this.containerRef_) this.resizeListener_.observe(this.containerRef_);
  };

  private bindCanvasRef_ = (ref: HTMLCanvasElement) => {
    this.canvasRef_ = ref;
  };

  private setItemEnabled(itemName: string, isEnabled: boolean) {
    isEnabled
      ? this.space.createItem({ default: itemName })
      : this.space.destroyItem(itemName);
  }

  render() {
    return (
      <Container ref={this.bindContainerRef_}>
        <Canvas ref={this.bindCanvasRef_} />
      </Container>
    );
  }
}
