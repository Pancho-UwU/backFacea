export class validatorRut{
    static validarRutChileno(rut) {
        if (!rut) return false;
        
        rut = rut.replace(/\./g, '').replace(/-/g, '');
        const dv = rut.slice(-1).toUpperCase();
        const rutNumerico = rut.slice(0, -1);
        
        if (!/^\d+$/.test(rutNumerico)) return false;
        
        const dvEsperado = this.calcularDigitoVerificador(rutNumerico);
        
        return dv === dvEsperado;
    }

    static calcularDigitoVerificador(rutSinDv) {
        let suma = 0;
        let multiplicador = 2;

        for (let i = rutSinDv.length - 1; i >= 0; i--) {
            suma += parseInt(rutSinDv.charAt(i)) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const resto = suma % 11;
        const resultado = 11 - resto;

        if (resultado === 11) return '0';
        if (resultado === 10) return 'K';
        return resultado.toString();
    }
}