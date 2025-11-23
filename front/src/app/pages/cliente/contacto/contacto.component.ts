import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {

  // Método simple para simular envío
  enviarMensaje() {
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje Enviado!',
      text: 'Gracias por contactarnos. Te responderemos pronto.',
      confirmButtonColor: '#7951a8',
      background: '#fff',
      customClass: {
        popup: 'rounded-alert',
        confirmButton: 'rounded-btn-alert'
      }
    });
  }
}