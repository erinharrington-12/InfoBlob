import * as Babylon from 'babylonjs';
import Sensor from './Sensor';
import SensorObject from './SensorObject';

const vecToLocal = (vector: Babylon.Vector3, mesh: Babylon.AbstractMesh): Babylon.Vector3 => {
  const matrix = mesh.getWorldMatrix();
  return Babylon.Vector3.TransformCoordinates(vector, matrix);
};

export class EtSensor implements SensorObject {
  private config_: SensorObject.Config<Sensor.Et>;

  private ray: Babylon.Ray;
  private visualMesh: Babylon.LinesMesh;

  private readonly VISUAL_MESH_NAME = "etlinemesh";

  get sensor(): Sensor.Et {
    return this.config_.sensor;
  }

  constructor(config: SensorObject.Config<Sensor.Et>) {
    const sensor = Sensor.Et.fill(config.sensor);
    this.config_ = { ...config, sensor };

    this.ray = new Babylon.Ray(Babylon.Vector3.Zero(), Babylon.Vector3.Zero(), this.config_.sensor.maxRange);
    this.visualMesh = Babylon.MeshBuilder.CreateLines(
      this.VISUAL_MESH_NAME,
      {
        points: [Babylon.Vector3.Zero(), Babylon.Vector3.Zero()],
        updatable: true,
      },
      this.config_.scene
    );

    this.isVisible = this.config_.sensor.visible;
    console.log(config);

    console.log(this.config_.scene);

  }

  // Updates the state of the sensor
  // Should call before getValue() or updateVisual()
  public update(): boolean {
    const forwardPoint = vecToLocal(this.config_.sensor.forward, this.config_.mesh);
    const originPoint = vecToLocal(this.config_.sensor.origin, this.config_.mesh);

    let forwardDirection = forwardPoint.subtract(this.config_.mesh.absolutePosition);
    forwardDirection = Babylon.Vector3.Normalize(forwardDirection);
    
    this.ray.origin = originPoint;
    this.ray.direction = forwardDirection;
    // this.ray.length = this.maxRange;


    return true;
  }

  public getValue(): SensorObject.Value {
    const hit = this.config_.scene.pickWithRay(this.ray);
    if (!hit.pickedMesh) return SensorObject.Value.u8(255);
    
    return SensorObject.Value.u8(this.distanceToSensorValue(hit.distance)); 
  }

  public updateVisual(): boolean {
    if (!this.isVisible) return false;

    const newLinePoints = [this.ray.origin, this.ray.origin.add(this.ray.direction.scale(this.ray.length))];
    this.visualMesh = Babylon.MeshBuilder.CreateLines(this.VISUAL_MESH_NAME, { points: newLinePoints, instance: this.visualMesh }, this.config_.scene);
    
    return true;
  }

  public dispose(): void {
    this.visualMesh.dispose();
  }

  public get isVisible(): boolean {
    return this.visualMesh.isEnabled();
  }
  
  public set isVisible(v: boolean) {
    this.visualMesh.setEnabled(v);
  }

  // Converts from 3D world distance to sensor output value
  private distanceToSensorValue(distance: number): number {
    return 255 - Math.floor((distance / this.config_.sensor.maxRange) * 255);
  }
}

