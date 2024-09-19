

// Respuesta de éxito
export const good_response = ({ data = {}, message = "" }: { data?: any; message?: string }) => ({
    success: true,
    message,
    data
});

// Respuesta de error
export const bad_response = ({ data = {}, message = "" }: { data?: any; message?: string }) => ({
    success: false,
    message,
    data
});

// Respuesta de error para una petición incorrecta
export const error_response = ({ data = {}, message = "" }: { data?: any; message?: string }) => ({
    success: false,
    message,
    data
});