import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { Reporte } from "../../Domain/Entities/reporte";
import fs from 'fs'


export class PDFService {

    private  xpos:number = 0;
    private  ypos:number = 0;
    private  reporte: Reporte;
    private  totalPagesExp: string = '{total_pages_count_string}'


    constructor(reporte_:Reporte){
      this.reporte = reporte_;
    }

    public createPDF_FromIssues(): jsPDF{
        const doc = new jsPDF();
        doc.setFontSize(32)
        doc.setFont("courier","bold");
        doc.text("Reporte de incidencias",35,25);
        this.xpos +=35;
        this.ypos +=25;
        let total_tablas = this.reporte.contarPlantasDiferentes();
        console.log("TOtal tablas: " + total_tablas);
        total_tablas = 7;
        let page_size = doc.internal.pageSize
        const base64_img = this.base64_encode('./src/Assets/universidad-de-zaragoza.png')
        doc.addImage(base64_img, 'png', 0, 0, page_size.width, page_size.height);
        for (let i = 1; i <= total_tablas; i++) {
          const planta_iesima = this.reporte.obtenerPlantaIndice(i);
          //console.log(i + " Planta iesima: " + planta_iesima);
          const total_incidencias = this.reporte.obtenerTotalIncidenciasDeUnaPlanta(planta_iesima)
          //console.log(i + " Total issies: " + total_incidencias);
          //Comprobamos que hay incidencias en esa planta de lo contrario pasamos a la siguiente planta.
          if( total_incidencias !== 0) {
            if(  ((page_size.height - 10) - (this.ypos + 35)) <= 10 ) {
                doc.addPage();
                doc.addImage(base64_img, 'png', 0, 0, page_size.width, page_size.height);
                this.ypos = 0;
            }
            doc.setFontSize(18)
            doc.text(`Planta ${planta_iesima}: ${total_incidencias} incidencia(s) total(es)`, 14, this.ypos + 20)
            autoTable(doc,
              { head: this.headRows(), 
                body: this.bodyRows(total_incidencias,planta_iesima), 
                startY: this.ypos + 25, 
                theme: 'grid',
                rowPageBreak: 'auto',
                tableLineColor: "#898d91",
                tableLineWidth: 0.3,
                styles: {
                  lineColor: "#898d91",
                  lineWidth: 0.3,
                },
                //Estilos para el cuerpo de las tablas
                bodyStyles: { 
                  fontStyle: 'bold',
                  halign: 'center',
                  fontSize: 10,
                },
                //Estilos para las cabeceras de las tablas
                headStyles: { 
                  halign: 'center',
                  fontSize: 15,
                },
                //Para dibujar el footer.
                didDrawPage: function (data) {
                  var totalPagesExp = '{total_pages_count_string}'
                  // Dibujamos el footer 
                  var str = 'Página ' + doc.getNumberOfPages()
                  // Total page solo a partir de jspdf v1.0+
                  if (typeof doc.putTotalPages === 'function') {
                    str = str + ' de ' + totalPagesExp
                  }
                  doc.setFontSize(10)
                  // jsPDF 1.4+ getWidth, <1.4 usa .width
                  var pageSize = doc.internal.pageSize
                  var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                  doc.text(str, data.settings.margin.left, pageHeight - 10)
                  
                },
                //Para poner el color a las filas de las tablas de incidencias.
                didParseCell: function (data) {
                  if(data.row.section === 'body'){
                    for(let i = 0; i < 6; i++){
                      if(data.cell.raw === 'Nueva incidencia'){
                        data.row.cells[i].styles.fillColor = "#E7FA99"
                      }else if(data.cell.raw === 'Bajo revisión'){
                        data.row.cells[i].styles.fillColor = "#81C0FF"
                      }else if(data.cell.raw === 'Revisada'){
                        data.row.cells[i].styles.fillColor = "#A4F2AC"
                      }
                    }
                  }
                }
                
            })
            const finalY = (doc as any).lastAutoTable.finalY;
            this.ypos = + finalY;
          }
        }
        if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(this.totalPagesExp);
        }
        doc.save('./src/Assets/test.pdf');
        return doc;
    }

    private bodyRows(rowCount: number,planta: string) {
        var body = []
        for (var j = 1; j <= rowCount; j++) {
          body.push(this.reporte.devolverDatosIesimos(planta,j))
        }
        return body
    }

    private headRows() {
        return [
          {
          titulo: 'Titulo', 
          descripcion: 'Descripcion', 
          estado: 'Estado', 
          etiquetas: 'Etiquetas', 
          nombre_espacio: "Espacio",
          edificio: 'Edificio' 
          },
        ]
      }

    private base64_encode(file: string) {
        return "data:image/png;base64,"+ fs.readFileSync(file, 'base64');
    }

}