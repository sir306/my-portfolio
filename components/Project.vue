<template>
  <div class="project-example text-white">
    <h1>{{ title }}</h1>
    <iframe
      class="w-11/12 md:w-1/2 h-96"
      :src="youtubeLink"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <p>{{ description }}</p>

    <!-- <a :href="githubLink">{{ githubTitle }}</a> -->
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
  props: ["title", "description", "youtubeLink", "githubLink", "githubTitle"],
};
</script>
