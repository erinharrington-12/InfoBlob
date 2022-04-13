//This is my updated Info for the Info_change branch
import * as React from 'react';

import { styled } from 'styletron-react';
import { RobotState } from '../../RobotState';
import { StyleProps } from '../../style';
import ScrollArea from '../ScrollArea';
import Section from '../Section';
import { ThemeProps } from '../theme';
import SensorWidget from './SensorWidget';
import { StyledText } from '../../util';
import { Location } from './Location';
import { RobotPosition } from '../../RobotPosition';
import { Fa } from '../Fa';
import RegisterState from '../../RegisterState'

export interface InfoProps extends StyleProps, ThemeProps {
  robotState: RobotState;
  robotStartPosition: RobotPosition;

  onSetRobotStartPosition: (position: RobotPosition) => void;
  
}

interface InfoState {
  collapsed: { [section: string]: boolean }
}

type Props = InfoProps;
type State = InfoState;

const Row = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  flexBasis: 0,
  alignItems: 'center',
  marginBottom: `${props.theme.itemPadding * 2}px`,
  ':last-child': {
    marginBottom: 0
  }
}));

const Container = styled('div', (props: ThemeProps) => ({
  flex: '1 1',
  color: props.theme.color,
  overflow: 'hidden'
}));

const StyledSection = styled(Section, {
});

const ItemName = styled('label', (props: ThemeProps) => ({
  flex: '1 1 0',
  borderRight: `1px solid ${props.theme.borderColor}`
}));

const Input = styled('input', (props: ThemeProps) => ({
  flex: '1 1 0',
  borderRadius: `${props.theme.itemPadding}px`,
  font: 'inherit',
  border: 'none',
  backgroundColor: 'transparent',
  color: props.theme.color,
  ':focus': {
    outline: 'none'
  }
}));


const ICON_STYLE: React.CSSProperties = {
  marginRight: '5px'
};

const BUTTON_NAME = StyledText.text({
  text: 'Buttons Box',
});

const SIMULATION_NAME = StyledText.text({
  text: 'Simulation',
});

const SERVOS_NAME = StyledText.text({
  text: 'Servos Here',
});

const MOTOR_VELOCITIES_NAME = StyledText.text({
  text: 'Motor Velocities Here',
});

const MOTOR_POSITIONS_NAME = StyledText.compose({
  items: [
    StyledText.text({
      text: 'Motor Positions',
    }),
  ]
});

const ANALOG_NAME = StyledText.text({
  text: 'Analog Sensors',
});

const DIGITAL_NAME = StyledText.text({
  text: 'Digital Sensors',
});

const ResetIcon = styled(Fa, ({ theme }: ThemeProps) => ({
  marginLeft: `${theme.itemPadding * 2}px`,
  opacity: 0.5,
  ':hover': {
    opacity: 1.0
  },
  transition: 'opacity 0.2s'
}));



const ButtonStyle = styled("button", props =>  ({

    color: "white",
    background: "#3d3b3b",
    border: "outset",
    borderRadius: '10px',
    padding: '10px',
    width: '45px',
    marginLeft: '5px',
    marginRight: '20px',
    alignContent: "center",
    font: 'inherit',
    cursor: 'pointer',
        
    })
);

const ButtonGroup = styled("button", props => ({
    
    marginLeft: '60px',
    backgroundColor: 'transparent',
    border: 'transparent',
    })
);
        
     



class Info extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      collapsed: {}
    };
  }

  private onCollapsedChange_ = (section: string) => (collapsed: boolean) => {
    this.setState({
      collapsed: {
        ...this.state.collapsed,
        [section]: collapsed
      }
    });
  };
 
  private onResetLocationClick_ = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSetRobotStartPosition(this.props.robotStartPosition);
  };

  
   private buttonClick = option =>{
    switch(option) {
        case "A": {
             this.props.robotState.buttons.a = 1;
            alert(this.props.robotState.buttons.a + ' ' + ((RegisterState.REG_RW_BUTTONS >> 0) & 1));
            
            break;
        };
            
        case "B":
            alert(this.props.robotState.buttons.b + ' ' + ((RegisterState.REG_RW_BUTTONS >> 1) & 1));
            break;
        case "C":
            alert(this.props.robotState.buttons.c);
            break;
        default:
            break;
    }
   };

  render() {
    const { props, state } = this;
    const {
      style,
      className,
      theme,
      robotState,
      robotStartPosition,
    } = props;
    const { collapsed } = state;

    const locationName = StyledText.compose({
      items: [
        StyledText.text({
          text: 'Start Location',
        }),
        StyledText.component({
          component: ResetIcon,
          props: {
            icon: 'sync',
            onClick: this.onResetLocationClick_,
            theme
          }
        })
      ]
    });




 const ButtonObject = () => {
          return (
            <>
                <ButtonGroup>
                    <ButtonStyle onClick = {() => this.buttonClick("A")}> A </ButtonStyle>
                    <ButtonStyle onClick = {() => this.buttonClick("B")}> B </ButtonStyle>
                    <ButtonStyle onClick = {() => this.buttonClick("C")}> C </ButtonStyle>
                </ButtonGroup>
            </>
 );
         
};  



  
    const servos = robotState.servoPositions.map((value, i) => (
      <Row key={`servo-pos-${i}`} theme={theme}>
        <SensorWidget value={value} name={`get_servo_position(${i})`} plotTitle='Servo Position Plot' theme={theme} />
      </Row>
    ));

    const motorVelocities = robotState.motorSpeeds.map((value, i) => (
      <Row key={`motor-velocity-${i}`} theme={theme}>
        <SensorWidget value={value} name={`motor ${i}`} plotTitle='Motor Velocity Plot' theme={theme} />
      </Row>
    ));

    const motorPositions = robotState.motorPositions.map((value, i) => (
      <Row key={`motor-pos-${i}`} theme={theme}>
        <SensorWidget value={value} name={`get_motor_position_counter(${i})`} plotTitle='Motor Position Plot' theme={theme} />
      </Row>
    ));

    const analogSensors = robotState.analogValues.map((value, i) => (
      <Row key={`analog-${i}`} theme={theme}>
        <SensorWidget value={value} name={`analog(${i})`} plotTitle='Analog Sensor Plot' theme={theme} />
      </Row>
    ));

    const digitalSensors = robotState.digitalValues.map((value, i) => (
      <Row key={`digital-${i}`} theme={theme}>
        <SensorWidget value={value} name={`digital(${i})`} plotTitle='Digital Sensor Plot' theme={theme} />
      </Row>
    ));
    
    return (
      <ScrollArea theme={theme} style={{ flex: '1 1' }}>
        <Container theme={theme} style={style} className={className}>
          <StyledSection
            name={locationName}
            theme={theme}
            onCollapsedChange={this.onCollapsedChange_('location')}
            collapsed={collapsed['location']}
          >
            <Location
              robotStartPosition={robotStartPosition}
              onSetRobotStartPosition={this.props.onSetRobotStartPosition}
              theme={theme}
            />
          </StyledSection>
          <StyledSection
            name = {BUTTON_NAME}
            theme = {theme}
            onCollapsedChange={this.onCollapsedChange_('button_pos')}
            collapsed={collapsed['button_pos']}
          >
            
          {ButtonObject()}
          </StyledSection>
          <StyledSection
            name={SERVOS_NAME}
            theme={theme}
            onCollapsedChange={this.onCollapsedChange_('servo_pos')}
            collapsed={collapsed['servo_pos']}
          >
            {servos}
          </StyledSection>
          <StyledSection
            name={MOTOR_VELOCITIES_NAME}
            theme={theme}
            onCollapsedChange={this.onCollapsedChange_('motor_vel')}
            collapsed={collapsed['motor_vel']}
          >
            {motorVelocities}
          </StyledSection>
          <StyledSection
            name={MOTOR_POSITIONS_NAME}
            theme={theme}
            onCollapsedChange={this.onCollapsedChange_('motor_pos')}
            collapsed={collapsed['motor_pos']}
          >
            {motorPositions}
          </StyledSection>
          <StyledSection
            name={ANALOG_NAME}
            theme={theme}
            onCollapsedChange={this.onCollapsedChange_('analog')}
            collapsed={collapsed['analog']}
          >
            {analogSensors}
          </StyledSection>
          <StyledSection
            name={DIGITAL_NAME}
            theme={theme}
            onCollapsedChange={this.onCollapsedChange_('digital')}
            collapsed={collapsed['digital']}
          >
            {digitalSensors}
          </StyledSection>
        </Container>
      </ScrollArea>
    );
  }
}

export default Info;