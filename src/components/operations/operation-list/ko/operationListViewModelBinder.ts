import { ViewModelBinder } from "@paperbits/common/widgets";
import { OperationListViewModel } from "./operationListViewModel";
import { OperationListModel } from "../operationListModel";
import { Bag } from "@paperbits/common";
import { EventManager } from "@paperbits/common/events";

export class OperationListViewModelBinder implements ViewModelBinder<OperationListModel, OperationListViewModel> {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: OperationListModel, viewModel?: OperationListViewModel, bindingContext?: Bag<any>): Promise<OperationListViewModel> {
        if (!viewModel) {
            viewModel = new OperationListViewModel();
        }

        viewModel.runtimeConfig(JSON.stringify({
            allowSelection: model.allowSelection,
            defaultGroupByTagToEnabled: model.defaultGroupByTagToEnabled,
            detailsPageUrl: model.detailsPageHyperlink
                ? model.detailsPageHyperlink.href
                : undefined
        }));

        viewModel["widgetBinding"] = {
            displayName: "List of operations",
            model: model,
            draggable: true,
            editor: "operation-list-editor",
            applyChanges: async (updatedModel: OperationListModel) => {
                await this.modelToViewModel(updatedModel, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: OperationListModel): boolean {
        return model instanceof OperationListModel;
    }
}