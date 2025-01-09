export interface Video {
  id: number;
  title: string;
  descripcion: string;
  img_video?: string;
  video_url?: string;
  estatus: boolean;
  usuario_id: number;
  usuario_nombre: string;
  usuario_username: string;
  usuario_correo: string;
  created_at: Date;
  updated_at: Date;
  method: string;
}
