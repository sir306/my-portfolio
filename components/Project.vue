<template>
  <div class="project-example text-white">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <!-- <a :href="youtubeLink">{{ youtubeTitle }}</a>
    <a :href="githubLink">{{ githubTitle }}</a> -->
  </div>
</template>

<script>
export default {
  //   props: {
  //     title: String,
  //     description: String,
  //     youtubeTitle: String,
  //     youtubeLink: String,
  //     githubTitle: String,
  //     githubLink: String,
  //   },
  props: ["title", "description"],
};
</script>
