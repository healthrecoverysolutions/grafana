import { PanelPlugin } from '@grafana/data';
import { TablePanel } from './TablePanel';
import { schemaInfo, PanelOptions, PanelFieldConfig, defatulPanelOptions, defatulPanelFieldConfig } from './models.gen';
import { tableMigrationHandler, tablePanelChangedHandler } from './migrations';
import { TableCellDisplayMode } from '@grafana/ui';

export const plugin = new PanelPlugin<PanelOptions, PanelFieldConfig>(TablePanel)
  .setPanelChangeHandler(tablePanelChangedHandler)
  .setMigrationHandler(tableMigrationHandler)
  .setModelSchemaInfo(schemaInfo)
  .setNoPadding()
  .useFieldConfig({
    useCustomConfig: (builder) => {
      builder
        .addNumberInput({
          path: 'width',
          name: 'Column width',
          settings: {
            placeholder: 'auto',
            min: 20,
            max: 300,
          },
          shouldApply: () => true,
        })
        .addRadio({
          path: 'align',
          name: 'Column alignment',
          settings: {
            options: [
              { label: 'auto', value: null },
              { label: 'left', value: 'left' },
              { label: 'center', value: 'center' },
              { label: 'right', value: 'right' },
            ],
          },
          defaultValue: defatulPanelFieldConfig.align,
        })
        .addSelect({
          path: 'displayMode',
          name: 'Cell display mode',
          description: 'Color text, background, show as gauge, etc',
          settings: {
            options: [
              { value: TableCellDisplayMode.Auto, label: 'Auto' },
              { value: TableCellDisplayMode.ColorText, label: 'Color text' },
              { value: TableCellDisplayMode.ColorBackground, label: 'Color background' },
              { value: TableCellDisplayMode.GradientGauge, label: 'Gradient gauge' },
              { value: TableCellDisplayMode.LcdGauge, label: 'LCD gauge' },
              { value: TableCellDisplayMode.BasicGauge, label: 'Basic gauge' },
              { value: TableCellDisplayMode.JSONView, label: 'JSON View' },
              { value: TableCellDisplayMode.Image, label: 'Image' },
            ],
          },
          defaultValue: defatulPanelFieldConfig.displayMode,
        })
        .addBooleanSwitch({
          path: 'filterable',
          name: 'Column filter',
          description: 'Enables/disables field filters in table',
          defaultValue: defatulPanelFieldConfig.filterable,
        });
    },
  })
  .setPanelOptions((builder) => {
    builder.addBooleanSwitch({
      path: 'showHeader',
      name: 'Show header',
      description: "To display table's header or not to display",
      defaultValue: defatulPanelOptions.showHeader,
    });
  });
