
export interface Comentario {
  id: number;
  mensaje: string;
  usuarioId: number;
  usuarioUsername: string;
  usuarioCorreo: string;
  img_usuario: string;
  created_at: Date;
  updated_at: Date;
  method: string;
}
