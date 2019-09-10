/* eslint-disable */
<template>
    <div class="md-layout md-algnment-center-center">
        <md-empty-state style="margin:auto;" md-rounded md-icon="sentiment_dissatisfied" md-label="No such page" md-description="No such page">
            <md-button class="md-primary" @click="$router.go(-1)">
                go Back
            </md-button>
        </md-empty-state>
    </div>
</template>
