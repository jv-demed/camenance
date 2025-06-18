import Swal from 'sweetalert2';

export class AlertService {

    static fastSuccess(){
        Swal.fire({
            icon: 'success',
            iconColor: '#3b82f6',
            position: 'center',
            showConfirmButton: false,
            text: 'Sucesso!',
            timer: 1000,
            width: '200px'
        });
    }
    
    static error(text){
        Swal.fire({
            confirmButtonColor: 'tomato',
            confirmButtonText: 'Ok',
            icon: 'error',
            iconColor: 'tomato',
            text: text,
            title: 'Oops...'
        });
    }

}