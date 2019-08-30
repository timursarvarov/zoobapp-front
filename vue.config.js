module.exports = {
    runtimeCompiler: true,
    devServer: {
        port: 8080,
        open: true,
    },
    lintOnSave: process.env.NODE_ENV !== 'production',
};
