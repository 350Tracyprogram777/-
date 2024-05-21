<template>
	<view>
		<official-account @error="gzhErr" @load="gzhErr"></official-account>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			 gzhErr(e){
				console.log('SKDJF;ADSKJF;KDSA',e)
			}
		}
	}
</script>

<style>

</style>
