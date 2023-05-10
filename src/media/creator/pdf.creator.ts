import PDFDocument from 'pdfkit';

export class PDFCreator {
  private readonly pdfDocument: PDFKit.PDFDocument;
  private readonly buffers: Buffer[];

  constructor(
    options: PDFKit.PDFDocumentOptions,
    private readonly headerText: string,
    private readonly footerText: string,
  ) {
    this.pdfDocument = new PDFDocument(options);
    this.buffers = [];
    this.registerEvent();
  }

  private registerEvent(): void {
    this.pdfDocument.on('data', (chunk: Buffer) => {
      this.buffers.push(chunk);
    });
  }

  getPdfDocument(): PDFKit.PDFDocument {
    return this.pdfDocument;
  }

  addHeader(): void {
    this.pdfDocument
      .fontSize(25)
      .text(this.headerText, 0, 50, { height: 25, align: 'center' });
  }

  addFooter(): void {
    this.pdfDocument
      .fontSize(10)
      .text(this.footerText, 0, this.pdfDocument.page.height - 50, {
        align: 'center',
        height: 10,
      });
  }

  loadContent(): void {
    const dataTest = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    const textOptions: PDFKit.Mixins.TextOptions = {
      listType: 'bullet',
      textIndent: 20,
    };
    this.pdfDocument.fontSize(14);
    this.pdfDocument.moveDown(2);
    this.pdfDocument.list(dataTest, 20, this.pdfDocument.y, textOptions);
    this.pdfDocument.moveDown(2);
    this.pdfDocument.text('Ahihi');
  }

  createBufferPdf(): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      this.pdfDocument.on('error', (err: Error) => {
        reject(err);
      });

      this.pdfDocument.on('end', () => {
        resolve(Buffer.concat(this.buffers));
      });

      this.pdfDocument.end();
    });
  }
}
