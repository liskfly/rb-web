<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
            <div class="flex justify-between">
                <div>
                    <el-button type="primary" size="small" @click="openAddTemp">添加</el-button>
                </div>
                <el-form size="small" :model="getForm" label-width="auto" :inline="true">
                    <el-form-item label="名称" prop="RuleName" class="mb-2">
                        <el-input v-model="getForm.RuleName" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item label="物料编码" prop="ProductName" class="mb-2">
                        <el-input v-model="getForm.ProductName" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item label="物料描述" prop="ProductDescript" class="mb-2">
                        <el-input v-model="getForm.ProductDescript" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <tableTemp :showIndex="true" :size="'small'" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></tableTemp>
        </el-card>
        <el-dialog v-model="addTempVisible" title="添加成品包装模板标签" draggable width="1200px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="addTempCancel">
            <el-form ref="addFormRef" size="small" :model="addForm" :inline="true" label-width="auto">
                <el-form-item label="物料编码" prop="ProductName">
                    <el-select-v2 v-model="addForm.ProductName" :options="materData" filterable :props="props"
                        style="width: 180px" @change="getBasMaterialData" />
                </el-form-item>
                <el-form-item label="物料描述" prop="ProductDescript">
                    <el-input v-model="ProductDescript" disabled style="width: 240px" />
                </el-form-item>
                <el-form-item label="名称" prop="RuleName">
                    <el-input v-model="addForm.RuleName" style="width: 180px" />
                </el-form-item>
                <el-form-item label="备注" prop="TemplateRemark">
                    <el-input v-model="addForm.TemplateRemark" type="textarea" style="width: 180px" />
                </el-form-item>
                <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="tabChange">
                    <el-tab-pane label="传感器模版" name="TemplateBox">
                        <el-form-item label="模板" prop="TemplateBox" label-width="68px">
                            <!-- <el-input v-model="addForm.TemplateBox" style="width: 180px" /> -->
                            <el-select-v2 v-model="addForm.TemplateBox" :options="tempList" filterable
                                :props="tempProps" style="width: 180px"
                                @change="getRuleNameData(addForm.TemplateBox)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码;[YMC]年月代码</span>
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName">
                                        <!-- <template #default="{ item }">
                                            <span style="margin-right: 8px; font-size: 12px">{{ item.Temppara_Name }}</span>
                                            <span style="color: var(--el-text-color-secondary); font-size: 12px">
                                                {{ item.Temppara_No }}
                                            </span>
                                        </template> -->
                                    </el-select-v2>
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="外箱码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="addItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="addDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="addForm.tempcontent01" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="外箱码" />
                            <el-table-column prop="TempRlueEnable2" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="变送器模板" name="TemplateFuselage">
                        <el-form-item label="模板" prop="TemplateFuselage" label-width="68px">
                            <el-select-v2 v-model="addForm.TemplateFuselage" :options="tempList" filterable
                                :props="tempProps" style="width: 180px"
                                @change="getRuleNameData(addForm.TemplateFuselage)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                            <!-- <el-input v-model="addForm.TemplateFuselage" style="width: 180px" /> -->
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="addItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="addDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="addForm.tempcontent02" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="清洗模板" name="Template01">
                        <el-form-item label="模板" prop="Template01" label-width="68px">
                            <el-select-v2 v-model="addForm.Template01" :options="tempList" filterable :props="tempProps"
                                style="width: 180px" @change="getRuleNameData(addForm.Template01)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                            <!-- <el-input v-model="addForm.Template01" style="width: 180px" /> -->
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="addItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="addDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="addForm.tempcontent03" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="箱模板" name="Template02">
                        <el-form-item label="模板" prop="Template02" label-width="68px">
                            <el-select-v2 v-model="addForm.Template02" :options="tempList" filterable :props="tempProps"
                                style="width: 180px" @change="getRuleNameData(addForm.Template02)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                            <!-- <el-input v-model="addForm.Template02" style="width: 180px" /> -->
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="addItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="addDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="addForm.tempcontent04" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="标签三模板" name="Template03">
                        <el-form-item label="模板" prop="Template03" label-width="68px">
                            <el-select-v2 v-model="addForm.Template03" :options="tempList" filterable :props="tempProps"
                                style="width: 180px" @change="getRuleNameData(addForm.Template03)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="addItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="addDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="addForm.tempcontent05" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="公用流水" name="Template04">
                        <div class="mb-3 mt-3 text-xs">
                            特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码
                        </div>

                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="editItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="editDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="addForm.tempcontent06" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange"
                            @row-dblclick="rowDblclick">
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="是否启用" />
                        </el-table>
                    </el-tab-pane> -->
                </el-tabs>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addTempCancel">关闭</el-button>
                    <el-button type="primary" @click="addTempConfirm"> 保存 </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="editTempVisible" title="修改成品包装模板标签" draggable width="1200px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="editTempCancel">
            <el-form ref="editFormRef" size="small" :model="editForm" :inline="true" label-width="auto">
                <el-form-item label="物料编码" prop="ProductName">
                    <el-select-v2 v-model="editForm.ProductName" :options="materData" disabled filterable :props="props"
                        style="width: 180px" />
                </el-form-item>
                <el-form-item label="物料描述" prop="ProductDescript">
                    <el-input v-model="ProductDescript" disabled style="width: 240px" />
                </el-form-item>
                <el-form-item label="名称" prop="RuleName">
                    <el-input v-model="editForm.RuleName" style="width: 180px" />
                </el-form-item>
                <el-form-item label="备注" prop="TemplateRemark">
                    <el-input v-model="editForm.TemplateRemark" type="textarea" style="width: 180px" />
                </el-form-item>
                <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="tabChange1">
                    <el-tab-pane label="传感器模版" name="TemplateBox">
                        <el-form-item label="模板" prop="TemplateBox" label-width="68px">
                            <!-- <el-input v-model="addForm.TemplateBox" style="width: 180px" /> -->
                            <el-select-v2 v-model="editForm.TemplateBox" :options="tempList" filterable
                                :props="tempProps" style="width: 180px"
                                @change="getRuleNameData(editForm.TemplateBox)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="外箱码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="editItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="editDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="editForm.tempcontent01" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange"
                            @row-dblclick="rowDblclick" highlight-current-row>
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="外箱码" />
                            <el-table-column prop="TempRlueEnable2" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="变送器模板" name="TemplateFuselage">
                        <el-form-item label="模板" prop="TemplateFuselage" label-width="68px">
                            <el-select-v2 v-model="editForm.TemplateFuselage" :options="tempList" filterable
                                :props="tempProps" style="width: 180px"
                                @change="getRuleNameData(editForm.TemplateFuselage)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                            <!-- <el-input v-model="addForm.TemplateFuselage" style="width: 180px" /> -->
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="editItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="editDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="editForm.tempcontent02" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange"
                            @row-dblclick="rowDblclick" highlight-current-row>
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="清洗模板" name="Template01">
                        <el-form-item label="模板" prop="Template01" label-width="68px">
                            <el-select-v2 v-model="editForm.Template01" :options="tempList" filterable
                                :props="tempProps" style="width: 180px"
                                @change="getRuleNameData(editForm.Template01)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                            <!-- <el-input v-model="addForm.Template01" style="width: 180px" /> -->
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="editItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="editDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="editForm.tempcontent03" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange"
                            @row-dblclick="rowDblclick" highlight-current-row>
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="箱模板" name="Template02">
                        <el-form-item label="模板" prop="Template02" label-width="68px">
                            <el-select-v2 v-model="editForm.Template02" :options="tempList" filterable
                                :props="tempProps" style="width: 180px"
                                @change="getRuleNameData(editForm.Template02)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                            <!-- <el-input v-model="addForm.Template02" style="width: 180px" /> -->
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                    <!-- <el-input v-model="form.TempRlueName" style="width: 180px" /> -->
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="editItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="editDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="editForm.tempcontent04" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange"
                            @row-dblclick="rowDblclick" highlight-current-row>
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="标签三模板" name="Template03">
                        <el-form-item label="模板" prop="Template03" label-width="68px">
                            <el-select-v2 v-model="editForm.Template03" :options="tempList" filterable
                                :props="tempProps" style="width: 180px"
                                @change="getRuleNameData(editForm.Template03)" />
                            <span>特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码</span>
                        </el-form-item>
                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="客户成品码" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable2" label="公用流水" class="ml-3" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable3" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="editItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="editDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="editForm.tempcontent05" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange"
                            @row-dblclick="rowDblclick" highlight-current-row>
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />
                            <el-table-column prop="TempRlueEnable1" label="客户成品码" />
                            <el-table-column prop="TempRlueEnable2" label="公用流水" />
                            <el-table-column prop="TempRlueEnable3" label="是否启用" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="公用流水" name="Template04">
                        <div class="mb-3 mt-3 text-xs">
                            特殊规则:[yyM]/[yyMM]/[yyyyMM]年月;[yyWW]年周;[yyMMdd]年月日;[SN:长度:起始流水]流水号:长度:起始流水;[YMC]年月代码
                        </div>

                        <div class="flex">
                            <el-form ref="formRef" size="small" :model="form" :inline="true" label-width="auto">
                                <el-form-item label="规则名称" prop="TempRlueName">
                                    <el-select-v2 v-model="form.TempRlueName" :options="ruleData" filterable
                                        :props="ruleProps" style="width: 180px" @change="changeRlueName" />
                                </el-form-item>
                                <el-form-item label="条码格式" prop="barFormat">
                                    <el-input v-model="barFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码预览" prop="TempRlueFormat">
                                    <el-input v-model="form.TempRlueFormat" disabled style="width: 180px" />
                                </el-form-item>
                                <el-form-item label="条码前缀1" prop="TempRluePrefixSuffix01">
                                    <el-input v-model="form.TempRluePrefixSuffix01" style="width: 180px"
                                        :disabled="isDisable1" />
                                </el-form-item>
                                <el-form-item label="条码前缀2" prop="TempRluePrefixSuffix02">
                                    <el-input v-model="form.TempRluePrefixSuffix02" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀3" prop="TempRluePrefixSuffix03">
                                    <el-input v-model="form.TempRluePrefixSuffix03" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码前缀4" prop="TempRluePrefixSuffix04">
                                    <el-input v-model="form.TempRluePrefixSuffix04" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀1" prop="TempRluePrefixSuffix05">
                                    <el-input v-model="form.TempRluePrefixSuffix05" style="width: 180px"
                                        :disabled="isDisable2" />
                                </el-form-item>
                                <el-form-item label="条码后缀2" prop="TempRluePrefixSuffix07">
                                    <el-input v-model="form.TempRluePrefixSuffix06" style="width: 180px"
                                        :disabled="isDisable2" />
                                    <el-checkbox v-model="form.TempRlueEnable1" label="启用" class="ml-3" />
                                </el-form-item>
                            </el-form>
                            <div class="flex flex-col justify-around items-center pl-10 pr-20">
                                <div>
                                    <el-button type="primary" size="large" @click="editItem">添加</el-button>
                                </div>
                                <div>
                                    <el-button type="danger" size="large" @click="editDelete">删除</el-button>
                                </div>
                            </div>
                        </div>
                        <el-table :data="editForm.tempcontent06" :style="{ width: '100%' }" stripe border fit
                            :height="250" size="small" @selection-change="handleSelectionChange"
                            @row-dblclick="rowDblclick" highlight-current-row>
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="index" align="center" fixed label="序号" width="55" />
                            <el-table-column prop="TempRlueName" label="规则名称" width="100" fixed />
                            <el-table-column prop="TempRlueFormat" label="条码格式" width="180" fixed />
                            <el-table-column prop="TempRluePrefixSuffix01" label="条码前缀1" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix02" label="条码前缀2" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix03" label="条码前缀3" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix04" label="条码前缀4" width="120" />
                            <el-table-column prop="TempRluePrefixSuffix05" label="条码后缀1" />
                            <el-table-column prop="TempRluePrefixSuffix06" label="条码后缀2" />

                            <el-table-column prop="TempRlueEnable1" label="是否启用" />
                        </el-table>
                    </el-tab-pane> -->
                </el-tabs>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editTempCancel">关闭</el-button>
                    <el-button type="primary" @click="editTempConfirm"> 保存 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryBarCodeRuleTemplatePartNum,
    QueryMESProductNameNews,
    QueryBarCodeRule_TemContentRule,
    QueryTeplateExistProductNameNews,
    InsertBarCodeRule_TemContentRules,
    UpdateBarCodeRule_TemContentRule,
    DeleteCodeRuleTemplatePartNum,
    QueryProductNameTemplateName,
    QueryBarCodeRuleTemplatePara,
    GetTempLabeReportParameter,
    JudgeTempParaContent,
} from "@/api/operate";
import tableTemp from "@/components/tableTem/index.vue";
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
    computed,
} from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { cloneDeep } from "lodash-es";
interface AddForm {
    RuleName: string;
    ProductName: string;
    TemplateRemark: string;
    TemplateBox: string;
    TemplateFuselage: string;
    Template01: string;
    Template02: string;
    Template03: string;
    tempcontent01: Array<Tempcontent>;
    tempcontent02: Array<Tempcontent>;
    tempcontent03: Array<Tempcontent>;
    tempcontent04: Array<Tempcontent>;
    tempcontent05: Array<Tempcontent>;
    tempcontent06: Array<Tempcontent>;
    UserNo: string;
}
interface Tempcontent {
    TempRlueName: string;
    TempRlueFormat: string;
    TempRluePrefixSuffix01: string;
    TempRluePrefixSuffix02: string;
    TempRluePrefixSuffix03: string;
    TempRluePrefixSuffix04: string;
    TempRluePrefixSuffix05: string;
    TempRluePrefixSuffix06: string;
    TempRlueEnable1: boolean;
    TempRlueEnable2: boolean;
    TempRlueEnable3: boolean;
}
const userStore = useUserStoreWithOut();
const getForm = ref({
    RuleName: "",
    ProductName: "",
    ProductDescript: "",
});
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
});
const ProductName = ref("");
const handleEdit = (row: any) => {
    ProductName.value = row.Template_PartNum;
    ProductDescript.value = row.Description;
    QueryBarCodeRule_TemContentRule({
        ProductName: row.Template_PartNum,
    }).then((res: any) => {
        // editForm.value={...res.content}
        editForm.value.ProductName = res.content.TemplatePartNum;
        editForm.value.RuleName = res.content.TemplateRuleName;
        editForm.value.TemplateRemark = res.content.TemplateRemark;
        editForm.value.TemplateBox = res.content.TemplateBox;
        editForm.value.TemplateFuselage = res.content.TemplateFuselage;
        editForm.value.Template01 = res.content.Template01;
        editForm.value.Template02 = res.content.Template02;
        editForm.value.Template03 = res.content.Template03;
        editForm.value.tempcontent01 = res.content.tempcontent01;
        editForm.value.tempcontent02 = res.content.tempcontent02;
        editForm.value.tempcontent03 = res.content.tempcontent03;
        editForm.value.tempcontent04 = res.content.tempcontent04;
        editForm.value.tempcontent05 = res.content.tempcontent05;
        editForm.value.tempcontent06 = res.content.tempcontent06;
        getRuleNameData(res.content.TemplateBox);
        getBasMaterialData(res.content.TemplatePartNum);
        editTempVisible.value = true;
    });
};
const handleDelete = (row: any) => {
    ElMessageBox.confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            DeleteCodeRuleTemplatePartNum({
                ProductName: row.Template_PartNum,
            }).then((res: any) => {
                //     ElNotification({
                //     title: "提示信息",
                //     message: res.msg,
                //     type: res.success?"success":"error",
                // });
                if (res.success) {
                    ElNotification({
                        title: "提示信息",
                        message: "删除成功",
                        type: "success",
                    });
                    getData();
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: "删除失败",
                        type: "error",
                    });
                }
            });
        })
        .catch(() => {
            ElNotification({
                title: "提示",
                message: "取消操作",
                type: "info",
            });
        });
};
const columnData = ref([
    {
        text: true,
        prop: "Template_PartNum",
        label: "物料编码",
        width: "120",
        // min: true,
        align: "1",
        fixed: true,
    },
    {
        text: true,
        prop: "Description",
        label: "物料描述",
        width: "180",
        // min: true,
        align: "1",
    },
    {
        text: true,
        prop: "BD_ProductModel",
        label: "机型",
        // width: "80",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_RuleName",
        label: "规则名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_NameBOX",
        label: "传感器模板",
        // width: "600",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_NameFuselage",
        label: "变送器模板",
        // width: "600",
        min: true,
        align: "1",
    },

    {
        text: true,
        prop: "Template_Name01",
        label: "清洗模板",
        // width: "600",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Template_Name02",
        label: "箱模板",
        // width: "600",
        min: true,
        align: "1",
    },

    {
        isOperation: true,
        label: "删除",
        width: "120",
        align: "center",
        fixed: "right",
        operation: [
            {
                type: "primary",
                label: "编辑",
                icon: "EditPen",
                buttonClick: handleEdit,
            },
            {
                type: "danger",
                label: "删除",
                icon: "Delete",
                buttonClick: handleDelete,
            },
        ],
    },

    //   {
    //     text: true,
    //     prop: "MfgOrderName",
    //     label: "生产计划号",
    //     width: "",
    //     min: true,
    //     align: "1",
    //   },
    //   {
    //     text: true,
    //     prop: "TxnDate",
    //     label: "烧录时间",
    //     width: "",
    //     min: true,
    //     align: "1",
    //   },
]);
const addTempVisible = ref(false);
const addForm = ref<AddForm>({
    RuleName: "",
    ProductName: "",
    TemplateRemark: "",
    TemplateBox: "",
    TemplateFuselage: "",
    Template01: "",
    Template02: "",
    Template03: "",
    tempcontent01: [],
    tempcontent02: [],
    tempcontent03: [],
    tempcontent04: [],
    tempcontent05: [],
    tempcontent06: [],
    UserNo: userStore.getUserInfo,
});
const editTempVisible = ref(false);
const editForm = ref<AddForm>({
    RuleName: "",
    ProductName: "",
    TemplateRemark: "",
    TemplateBox: "",
    TemplateFuselage: "",
    Template01: "",
    Template02: "",
    Template03: "",
    tempcontent01: [],
    tempcontent02: [],
    tempcontent03: [],
    tempcontent04: [],
    tempcontent05: [],
    tempcontent06: [],
    UserNo: userStore.getUserInfo,
});

const materData = ref([]);
const props = ref({
    label: "ProductName",
    value: "ProductName",
});
const ProductDescript = ref("");
const tempList = ref([]);
const tempProps = ref({
    label: "Template_Name",
    value: "Template_Name",
});
const ruleData = ref([]);
const ruleProps = ref({
    label: "Temppara_Name",
    value: "Temppara_No",
});
const activeName = ref("TemplateBox");
const form = ref({
    TempRlueName: "",
    TempRlueFormat: "",
    TempRluePrefixSuffix01: "",
    TempRluePrefixSuffix02: "",
    TempRluePrefixSuffix03: "",
    TempRluePrefixSuffix04: "",
    TempRluePrefixSuffix05: "",
    TempRluePrefixSuffix06: "",
    TempRlueEnable1: false,
    TempRlueEnable2: true,
    TempRlueEnable3: false,
});
const addFormRef = ref();
const editFormRef = ref();
const formRef = ref();
const barFormat = computed(() => {
    const barCodeFormat =
        form.value.TempRluePrefixSuffix01 +
        form.value.TempRluePrefixSuffix02 +
        form.value.TempRluePrefixSuffix03 +
        form.value.TempRluePrefixSuffix04 +
        form.value.TempRluePrefixSuffix05 +
        form.value.TempRluePrefixSuffix06;
    form.value.TempRlueFormat = barCodeFormat;
    return barCodeFormat;
});
const barPreview = computed(() => { });
const deleteData = ref([]);
const isDisable1 = ref(true);
const isDisable2 = ref(true);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    // getMesData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    QueryBarCodeRuleTemplatePartNum(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const getMesData = () => {
    QueryTeplateExistProductNameNews({
        ProductName: "",
        ProductDescript: "",
    }).then((res: any) => {
        materData.value = res.content;
    });
};
const getRuleNameData = (data: any) => {
    form.value.TempRlueName = "";
    form.value.TempRluePrefixSuffix01 = "";
    isDisable1.value = true;
    isDisable2.value = true;
    GetTempLabeReportParameter({
        TemplateName: data,
    }).then((res: any) => {
        ruleData.value = res.content;
    });
};
const changeRlueName = (val: any) => {
    form.value.TempRluePrefixSuffix01 = "";
    let isDisable = cloneDeep(
        ruleData.value.find((f: any) => f.Temppara_No == val)
    );

    if (isDisable.Expression_Name == "Customized") {
        isDisable1.value = false;
        isDisable2.value = false;
    } else if (isDisable.Expression_Name == "Fixed") {
        isDisable1.value = false;
        isDisable2.value = true;
    } else {
        isDisable1.value = true;
        isDisable2.value = true;

        form.value.TempRluePrefixSuffix01 = isDisable.Expression_Name;
    }
};
const getRuleData = () => {
    QueryBarCodeRuleTemplatePara({
        Temppara_No: "",
    }).then((res: any) => {
        ruleData.value = res.content;
    });
};
const openAddTemp = () => {
    QueryTeplateExistProductNameNews({
        ProductName: "",
        ProductDescript: "",
    }).then((res: any) => {
        materData.value = res.content;
        addTempVisible.value = true;
    });
    // getRuleData();
};
const addItem = () => {
    JudgeTempParaContent({
        Temppara_No: form.value.TempRlueName,
        Temppara_Value: form.value.TempRlueFormat,
    }).then((res: any) => {
        if (res.success) {
            if (activeName.value == "TemplateBox") {
                if (
                    addForm.value.tempcontent01.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    addForm.value.tempcontent01.push({ ...form.value });
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已存在`,
                        type: "error",
                    });
                }
            }
            if (activeName.value == "TemplateFuselage") {
                if (
                    addForm.value.tempcontent02.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    addForm.value.tempcontent02.push({ ...form.value });
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已存在`,
                        type: "error",
                    });
                }
            }
            if (activeName.value == "Template01") {
                if (
                    addForm.value.tempcontent03.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    addForm.value.tempcontent03.push({ ...form.value });
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已存在`,
                        type: "error",
                    });
                }
            }
            if (activeName.value == "Template02") {
                if (
                    addForm.value.tempcontent04.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    addForm.value.tempcontent04.push({ ...form.value });
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已存在`,
                        type: "error",
                    });
                }
            }
            if (activeName.value == "Template03") {
                if (
                    addForm.value.tempcontent05.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    addForm.value.tempcontent05.push({ ...form.value });
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已存在`,
                        type: "error",
                    });
                }
            }
            if (activeName.value == "Template04") {
                if (
                    addForm.value.tempcontent06.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    addForm.value.tempcontent06.push({ ...form.value });
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已存在`,
                        type: "error",
                    });
                }
            }
            if (activeName.value == "TemplateBox") {
                form.value.TempRlueEnable1 = false;
                form.value.TempRlueEnable2 = true;
                form.value.TempRlueEnable3 = false;
            } else if (activeName.value == "Template04") {
                form.value.TempRlueEnable1 = true;
                form.value.TempRlueEnable2 = false;
                form.value.TempRlueEnable3 = false;
            } else {
                form.value.TempRlueEnable1 = false;
                form.value.TempRlueEnable2 = false;
                form.value.TempRlueEnable3 = true;
            }
            isDisable1.value = true;
            isDisable2.value = true;
            formRef.value.resetFields();
        }
    });
};
const handleSelectionChange = (row: any) => {
    deleteData.value = cloneDeep(row);
};
const addDelete = () => {
    // console.log(deleteData.value);
    if (activeName.value == "TemplateBox") {
        addForm.value.tempcontent01 = addForm.value.tempcontent01.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "TemplateFuselage") {
        addForm.value.tempcontent02 = addForm.value.tempcontent02.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template01") {
        addForm.value.tempcontent03 = addForm.value.tempcontent03.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template02") {
        addForm.value.tempcontent04 = addForm.value.tempcontent04.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template03") {
        addForm.value.tempcontent05 = addForm.value.tempcontent05.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template04") {
        addForm.value.tempcontent06 = addForm.value.tempcontent06.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
};
const editItem = () => {
    JudgeTempParaContent({
        Temppara_No: form.value.TempRlueName,
        Temppara_Value: form.value.TempRlueFormat,
    }).then((res: any) => {
        if (res.success) {
            if (activeName.value == "TemplateBox") {
                if (
                    editForm.value.tempcontent01.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    editForm.value.tempcontent01.push({ ...form.value });
                } else {
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已修改`,
                        type: "success",
                    });
                    editForm.value.tempcontent01 = editForm.value.tempcontent01.map(
                        (item: any) => {
                            if (item.TempRlueName == form.value.TempRlueName) {
                                return { ...form.value };
                            } else {
                                return item;
                            }
                        }
                    );
                }
            }
            if (activeName.value == "TemplateFuselage") {
                if (
                    editForm.value.tempcontent02.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    editForm.value.tempcontent02.push({ ...form.value });
                } else {
                    //   ElNotification({
                    //     title: "提示信息",
                    //     message: `${form.value.TempRlueName}规则已存在`,
                    //     type: "error",
                    //   });
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已修改`,
                        type: "success",
                    });
                    editForm.value.tempcontent02 = editForm.value.tempcontent02.map(
                        (item: any) => {
                            if (item.TempRlueName == form.value.TempRlueName) {
                                return { ...form.value };
                            } else {
                                return item;
                            }
                        }
                    );
                }
            }
            if (activeName.value == "Template01") {
                if (
                    editForm.value.tempcontent03.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    editForm.value.tempcontent03.push({ ...form.value });
                } else {
                    //   ElNotification({
                    //     title: "提示信息",
                    //     message: `${form.value.TempRlueName}规则已存在`,
                    //     type: "error",
                    //   });
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已修改`,
                        type: "success",
                    });
                    editForm.value.tempcontent03 = editForm.value.tempcontent03.map(
                        (item: any) => {
                            if (item.TempRlueName == form.value.TempRlueName) {
                                return { ...form.value };
                            } else {
                                return item;
                            }
                        }
                    );
                }
            }
            if (activeName.value == "Template02") {
                if (
                    editForm.value.tempcontent04.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    editForm.value.tempcontent04.push({ ...form.value });
                } else {
                    //   ElNotification({
                    //     title: "提示信息",
                    //     message: `${form.value.TempRlueName}规则已存在`,
                    //     type: "error",
                    //   });
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已修改`,
                        type: "success",
                    });
                    editForm.value.tempcontent04 = editForm.value.tempcontent04.map(
                        (item: any) => {
                            if (item.TempRlueName == form.value.TempRlueName) {
                                return { ...form.value };
                            } else {
                                return item;
                            }
                        }
                    );
                }
            }
            if (activeName.value == "Template03") {
                if (
                    editForm.value.tempcontent05.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    editForm.value.tempcontent05.push({ ...form.value });
                } else {
                    //   ElNotification({
                    //     title: "提示信息",
                    //     message: `${form.value.TempRlueName}规则已存在`,
                    //     type: "error",
                    //   });
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已修改`,
                        type: "success",
                    });
                    editForm.value.tempcontent05 = editForm.value.tempcontent05.map(
                        (item: any) => {
                            if (item.TempRlueName == form.value.TempRlueName) {
                                return { ...form.value };
                            } else {
                                return item;
                            }
                        }
                    );
                }
            }
            if (activeName.value == "Template04") {
                if (
                    editForm.value.tempcontent06.findIndex(
                        (t: any) => t.TempRlueName == form.value.TempRlueName
                    ) == -1
                ) {
                    editForm.value.tempcontent06.push({ ...form.value });
                } else {
                    //   ElNotification({
                    //     title: "提示信息",
                    //     message: `${form.value.TempRlueName}规则已存在`,
                    //     type: "error",
                    //   });
                    ElNotification({
                        title: "提示信息",
                        message: `${form.value.TempRlueName}规则已修改`,
                        type: "success",
                    });
                    editForm.value.tempcontent06 = editForm.value.tempcontent06.map(
                        (item: any) => {
                            if (item.TempRlueName == form.value.TempRlueName) {
                                return { ...form.value };
                            } else {
                                return item;
                            }
                        }
                    );
                }
            }
            if (activeName.value == "TemplateBox") {
                form.value.TempRlueEnable1 = false;
                form.value.TempRlueEnable2 = true;
                form.value.TempRlueEnable3 = false;
            } else if (activeName.value == "Template04") {
                form.value.TempRlueEnable1 = true;
                form.value.TempRlueEnable2 = false;
                form.value.TempRlueEnable3 = false;
            } else {
                form.value.TempRlueEnable1 = false;
                form.value.TempRlueEnable2 = false;
                form.value.TempRlueEnable3 = true;
            }
            isDisable1.value = true;
            isDisable2.value = true;
            formRef.value.resetFields();
        }
    });
};

const editDelete = () => {
    // console.log(deleteData.value);
    if (activeName.value == "TemplateBox") {
        editForm.value.tempcontent01 = editForm.value.tempcontent01.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "TemplateFuselage") {
        editForm.value.tempcontent02 = editForm.value.tempcontent02.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template01") {
        editForm.value.tempcontent03 = editForm.value.tempcontent03.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template02") {
        editForm.value.tempcontent04 = editForm.value.tempcontent04.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template03") {
        editForm.value.tempcontent05 = editForm.value.tempcontent05.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
    if (activeName.value == "Template04") {
        editForm.value.tempcontent06 = editForm.value.tempcontent06.filter(
            (item: any) => {
                return !deleteData.value.some(
                    (delItem: any) => delItem.TempRlueName === item.TempRlueName
                );
            }
        );
    }
};
//添加取消
const addTempCancel = () => {
    addFormRef.value.resetFields();
    formRef.value.resetFields();
    ProductDescript.value = "";
    addForm.value.tempcontent01 = [];
    addForm.value.tempcontent02 = [];
    addForm.value.tempcontent03 = [];
    addForm.value.tempcontent04 = [];
    addForm.value.tempcontent05 = [];
    addForm.value.tempcontent06 = [];

    activeName.value = "TemplateBox";
    addTempVisible.value = false;
};
//添加保存
const addTempConfirm = () => {
    // console.log(addForm.value);
    InsertBarCodeRule_TemContentRules(addForm.value).then((res: any) => {
        ElNotification({
            title: "提示信息",
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (res.success) {
            addForm.value.tempcontent01 = [];
            addForm.value.tempcontent02 = [];
            addForm.value.tempcontent03 = [];
            addForm.value.tempcontent04 = [];
            addForm.value.tempcontent05 = [];
            addForm.value.tempcontent06 = [];
            getBarCodeRule_TemContentRuleAdd();
            getData();
        }
    });
};
//添加取消
const editTempCancel = () => {
    editFormRef.value.resetFields();
    formRef.value.resetFields();
    ProductDescript.value = "";
    editForm.value.tempcontent01 = [];
    editForm.value.tempcontent02 = [];
    editForm.value.tempcontent03 = [];
    editForm.value.tempcontent04 = [];
    editForm.value.tempcontent05 = [];
    editForm.value.tempcontent06 = [];
    activeName.value = "TemplateBox";

    editTempVisible.value = false;
};
//添加保存
const editTempConfirm = () => {
    // console.log(addForm.value);
    UpdateBarCodeRule_TemContentRule(editForm.value).then((res: any) => {
        ElNotification({
            title: "提示信息",
            message: res.msg,
            type: res.success ? "success" : "error",
        });
        if (res.success) {
            editForm.value.tempcontent01 = [];
            editForm.value.tempcontent02 = [];
            editForm.value.tempcontent03 = [];
            editForm.value.tempcontent04 = [];
            editForm.value.tempcontent05 = [];
            editForm.value.tempcontent06 = [];
            // editTempVisible.value = false;
            getBarCodeRule_TemContentRule();
            getData();
        }
    });
};

const getBarCodeRule_TemContentRuleAdd = () => {
    QueryBarCodeRule_TemContentRule({
        ProductName: addForm.value.ProductName,
    }).then((res: any) => {
        addForm.value.ProductName = res.content.TemplatePartNum;
        addForm.value.RuleName = res.content.TemplateRuleName;
        addForm.value.TemplateRemark = res.content.TemplateRemark;
        addForm.value.TemplateBox = res.content.TemplateBox;
        addForm.value.TemplateFuselage = res.content.TemplateFuselage;
        addForm.value.Template01 = res.content.Template01;
        addForm.value.Template02 = res.content.Template02;
        addForm.value.Template03 = res.content.Template03;
        addForm.value.tempcontent01 = res.content.tempcontent01;
        addForm.value.tempcontent02 = res.content.tempcontent02;
        addForm.value.tempcontent03 = res.content.tempcontent03;
        addForm.value.tempcontent04 = res.content.tempcontent04;
        addForm.value.tempcontent05 = res.content.tempcontent05;
        addForm.value.tempcontent06 = res.content.tempcontent06;
        // getRuleData();
        // getBasMaterialData(res.content.TemplatePartNum);
    });
};
const getBarCodeRule_TemContentRule = () => {
    QueryBarCodeRule_TemContentRule({
        ProductName: ProductName.value,
    }).then((res: any) => {
        // editForm.value={...res.content}
        editForm.value.ProductName = res.content.TemplatePartNum;
        editForm.value.RuleName = res.content.TemplateRuleName;
        editForm.value.TemplateRemark = res.content.TemplateRemark;
        editForm.value.TemplateBox = res.content.TemplateBox;
        editForm.value.TemplateFuselage = res.content.TemplateFuselage;
        editForm.value.Template01 = res.content.Template01;
        editForm.value.Template02 = res.content.Template02;
        editForm.value.Template03 = res.content.Template03;
        editForm.value.tempcontent01 = res.content.tempcontent01;
        editForm.value.tempcontent02 = res.content.tempcontent02;
        editForm.value.tempcontent03 = res.content.tempcontent03;
        editForm.value.tempcontent04 = res.content.tempcontent04;
        editForm.value.tempcontent05 = res.content.tempcontent05;
        editForm.value.tempcontent06 = res.content.tempcontent06;
        // getRuleData();
        getBasMaterialData(res.content.TemplatePartNum);
    });
};

const getBasMaterialData = (val: any) => {
    let data: any = materData.value.find((m: any) => m.ProductName === val);
    if (data != undefined) {
        ProductDescript.value = data.Description;
    }
    QueryProductNameTemplateName({ ProductName: val }).then((res: any) => {
        tempList.value = res.content;
    });
};
const tabChange = () => {
    ruleData.value = [];
    if (activeName.value == "TemplateBox") {
        form.value.TempRlueEnable1 = false;
        form.value.TempRlueEnable2 = true;
        form.value.TempRlueEnable3 = false;
        if (addForm.value.TemplateBox == "") return;
        getRuleNameData(addForm.value.TemplateBox);
    } else if (activeName.value == "Template04") {
        form.value.TempRlueEnable1 = true;
        form.value.TempRlueEnable2 = false;
        form.value.TempRlueEnable3 = false;
        getRuleData();
    } else {
        form.value.TempRlueEnable1 = false;
        form.value.TempRlueEnable2 = false;
        form.value.TempRlueEnable3 = true;
        if (activeName.value == "TemplateFuselage") {
            if (addForm.value.TemplateFuselage == "") return;
            getRuleNameData(addForm.value.TemplateFuselage);
        } else {
            if (activeName.value == "Template01") {
                if (addForm.value.Template01 == "") return;
                getRuleNameData(addForm.value.Template01);
            }
            if (activeName.value == "Template02") {
                if (addForm.value.Template02 == "") return;
                getRuleNameData(addForm.value.Template02);
            }
            if (activeName.value == "Template03") {
                if (addForm.value.Template03 == "") return;
                getRuleNameData(addForm.value.Template03);
            }
        }
    }

    formRef.value.resetFields();
};
const tabChange1 = () => {
    ruleData.value = [];
    if (activeName.value == "TemplateBox") {
        form.value.TempRlueEnable1 = false;
        form.value.TempRlueEnable2 = true;
        form.value.TempRlueEnable3 = false;
        // console.log(editForm.value);
        
        if (editForm.value.TemplateBox == ""){
            editFormRef.value.resetFields();
            return
        }

        getRuleNameData(editForm.value.TemplateBox);
    } else if (activeName.value == "Template04") {
        form.value.TempRlueEnable1 = true;
        form.value.TempRlueEnable2 = false;
        form.value.TempRlueEnable3 = false;
        // if (editForm.value.Template04 == ""){
        //             formRef.value.resetFields();
        //             return;
        //         }
        getRuleData();
    } else {
        form.value.TempRlueEnable1 = false;
        form.value.TempRlueEnable2 = false;
        form.value.TempRlueEnable3 = true;
        
        if (activeName.value == "TemplateFuselage") {
            if (editForm.value.TemplateFuselage == ""){
                formRef.value.resetFields();
                return;
            } 
            getRuleNameData(editForm.value.TemplateFuselage);
        } else {
            // console.log(activeName.value);
            
            if (activeName.value == "Template01") {
                if (editForm.value.Template01 == ""){
                    formRef.value.resetFields();
                    return;
                }
                getRuleNameData(editForm.value.Template01);
            }
            if (activeName.value == "Template02") {
                if (editForm.value.Template02 == ""){
                    formRef.value.resetFields();

                    return;
                }
                getRuleNameData(editForm.value.Template02);
            }
            if (activeName.value == "Template03") {
                if (editForm.value.Template03 == ""){
                    formRef.value.resetFields();
                    return;
                } 
                getRuleNameData(editForm.value.Template03);
            }
        }
    }

    formRef.value.resetFields();
};

const rowDblclick = (row: any) => {
    form.value = { ...row }
    let isDisable = cloneDeep(
        ruleData.value.find((f: any) => f.Temppara_No == row.TempRlueName)
    );

    if (isDisable.Expression_Name == "Customized") {
        isDisable1.value = false;
        isDisable2.value = false;
    } else if (isDisable.Expression_Name == "Fixed") {
        isDisable1.value = false;
        isDisable2.value = true;
    } else {
        isDisable1.value = true;
        isDisable2.value = true;

        form.value.TempRluePrefixSuffix01 = isDisable.Expression_Name;
    }
    //   changeRlueName(row.TempRlueName);
};
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};
</script>

<style lang="scss">
.el-tabs--border-card {
    border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
    --el-tabs-header-height: 30px;
    background-color: #006487 !important;
}

.demo-tabs .el-tabs__content {
    padding: 5px;
}

.demo-tabs.el-tabs--border-card>.el-tabs__header .el-tabs__item {
    color: #fff;
    font-size: 0.8rem;
    // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
    font-size: 0.8rem;
    // color: #fff;
    color: #006487 !important;
    // font-weight: bold;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    font-size: 0.8rem;
    color: #006487 !important;
    background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
