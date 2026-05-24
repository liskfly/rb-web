<template>
    <div>
        <el-form ref="formRef" :inline="true" :model="addForm" label-position="left" :rules="rules" label-width="auto">
            <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label" :prop="f.value">
                <el-input v-if="f.type == 'input' || f.type === 'password'" v-model="addForm[f.value]" :type="f.type"
                    :disabled="f.disabled" :placeholder="'请输入' + f.label" />
                <el-input v-if="f.type == 'textarea'" v-model="addForm[f.value]" :type="f.type" :disabled="f.disabled"
                    :placeholder="'请输入' + f.label" />
                <el-input-number v-if="f.type === 'inputNumber'" :disabled="f.disabled" v-model="addForm[f.value]"
                    :min="f.min" :max="f.max" />
                <el-select v-if="f.type === 'select'" v-model="addForm[f.value]" :disabled="f.disabled"
                    :clearable="f.clearable" :filterable="f.filterable" :placeholder="'请选择' + f.label">
                    <el-option v-for="(childItem, childIndex) in f.list" :key="childIndex" :label="childItem.key"
                        :value="childItem.value" />
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose, defineEmits, toRefs, computed, ref } from "vue"
const props = defineProps([ 'addForm', 'formHeader', 'rules'])
const { addForm, formHeader, rules } = toRefs(props)
const formRef = ref()
const cleanForm = () => {
    formRef.value.resetFields();
}
const validateJbxx = async () => {
    //校验成功则方法自动返回true，校验方法报错则说明校验失败，返回false
    try {
        return await formRef.value.validate()
    } catch (error) {
        return false
    }
}

defineExpose({
    cleanForm,
    validateJbxx
})
</script>
<style lang="scss" scoped></style>