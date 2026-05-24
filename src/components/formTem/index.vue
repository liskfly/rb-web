<template>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false"
        v-model="dialogVisible" :title="title" :width="width" @close="formCancel">
        <el-form ref="formRef" :model="form" label-position="left" :rules="rules" label-width="auto">
            <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label" :prop="f.value">
                <el-input v-if="f.type == 'input' || f.type === 'password'" v-model="form[f.value]" :type="f.type"
                    :disabled="f.disabled" :placeholder="f.placeholder" />
                <el-input v-if="f.type == 'textarea'" :rows="f.rows"  v-model="form[f.value]" :type="f.type" :disabled="f.disabled"
                    :placeholder="'请输入' + f.label" />
                <el-input-number v-if="f.type === 'inputNumber'" :disabled="f.disabled" v-model="form[f.value]"
                    :min="f.min" :max="f.max" />
                <el-select v-if="f.type === 'select'" @change="selectData" v-model="form[f.value]"
                    :disabled="f.disabled" :clearable="f.clearable" :filterable="f.filterable"
                    :placeholder="'请选择' + f.label">
                    <el-option v-for="(childItem, childIndex) in f.list" :key="childIndex" :label="childItem.key"
                        :value="childItem.key" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="formCancel">取消</el-button>
                <el-button type="primary" @click.stop="onSubmit"> 确定 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { toRefs, computed, ref } from "vue"
const props = defineProps(['visible', 'width', 'title', 'formRef', 'form', 'formHeader', 'rules'])
const { visible, width, title, form, formHeader, rules } = toRefs(props)
const emit = defineEmits(['formCancel', 'onSubmit','selectData'])
const formRef = ref()
const dialogVisible = computed({
    get() {
        return visible?.value
    },
    set(val) {
        return val
    }
})

const formCancel = () => {
    emit('formCancel')
}
const onSubmit = () => {
    emit('onSubmit')
}
const cleanForm = () => {
    formRef.value.resetFields();
}
const selectData = (val: any) => {
     emit('selectData',val)

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