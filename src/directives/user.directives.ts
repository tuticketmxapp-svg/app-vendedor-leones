import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterList'
})
export class FilterListPipe implements PipeTransform {
    transform(listObject: any[], propiedades: string[], filtro: string): any[] {
        if (!listObject) return [];
        if (!filtro) return listObject;

        return listObject.filter(item => {
            for (let propiedad of propiedades) {
                if (item[propiedad].toLowerCase().includes(filtro.toLowerCase())) {
                    return true;
                }
            }
            return false;
        });
    }
}