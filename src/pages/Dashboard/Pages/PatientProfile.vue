<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-patient-profile-form header-color="green">

        </edit-patient-profile-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <patient-card button-color="success">

        </patient-card>
      </div>
    </div>
  </div>
</template>

<script>
import { EditPatientProfileForm, PatientCard } from "@/pages";
export default {
  components: {
    EditPatientProfileForm,
    PatientCard
  }
};
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
