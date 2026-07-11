const DEFAULT_MARGIN = 48;

const appendWrappedText = (doc, text, x, yRef, maxWidth, options = {}) => {
  const {
    fontSize = 11,
    bold = false,
    spacingAfter = 0,
  } = options;

  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setFontSize(fontSize);

  const lines = doc.splitTextToSize(String(text ?? ''), maxWidth);
  const lineHeight = fontSize * 1.35;

  lines.forEach((line) => {
    if (yRef.current > doc.internal.pageSize.getHeight() - DEFAULT_MARGIN) {
      doc.addPage();
      yRef.current = DEFAULT_MARGIN;
    }

    doc.text(line, x, yRef.current);
    yRef.current += lineHeight;
  });

  yRef.current += spacingAfter;
};

export const downloadRegistrationPdf = async ({
  filename,
  title,
  subtitle,
  sections = [],
}) => {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - DEFAULT_MARGIN * 2;
  const yRef = { current: DEFAULT_MARGIN };

  appendWrappedText(doc, title, DEFAULT_MARGIN, yRef, contentWidth, {
    fontSize: 18,
    bold: true,
    spacingAfter: 4,
  });

  if (subtitle) {
    appendWrappedText(doc, subtitle, DEFAULT_MARGIN, yRef, contentWidth, {
      fontSize: 10,
      spacingAfter: 12,
    });
  }

  sections.forEach((section) => {
    if (yRef.current > doc.internal.pageSize.getHeight() - DEFAULT_MARGIN - 60) {
      doc.addPage();
      yRef.current = DEFAULT_MARGIN;
    }

    appendWrappedText(doc, section.title, DEFAULT_MARGIN, yRef, contentWidth, {
      fontSize: 13,
      bold: true,
      spacingAfter: 4,
    });

    section.rows.forEach((row) => {
      appendWrappedText(
        doc,
        `${row.label}: ${row.value ?? 'N/A'}`,
        DEFAULT_MARGIN + 12,
        yRef,
        contentWidth - 12,
        {
          fontSize: 11,
          spacingAfter: 2,
        }
      );
    });

    yRef.current += 8;
  });

  doc.save(filename);
};
