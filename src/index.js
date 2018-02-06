module.exports = function ({ types }) {
    const ret = {
        visitor: {
            ImportDeclaration(path) {
                const { node } = path;
                if (!node) return;

                const libraryName = '@qnpm/yis/components';
                if (node.source.value === libraryName) {
                    const compName = node.specifiers[0].local.name;
                    const compNameInLowerCase = compName.toLowerCase();

                    const styleIdentifierName = '__yis_style_' + compName;
                    // replace *** import { Page } from '@qnpm/yis/components' *** with below
                    path.replaceWithMultiple([
                        // const Page = YISComponents.Page
                        types.variableDeclaration('const',
                            [
                                types.variableDeclarator({
                                    type: "Identifier",
                                    name: compName
                                }, types.identifier("YISComponents." + compName))
                            ]
                        ),
                        // import __yis_style_Page = @qnpm/yis/components/page/page.css
                        types.importDeclaration([
                            types.importSpecifier(
                                types.identifier(styleIdentifierName),
                                types.identifier(styleIdentifierName)
                            )
                        ], types.stringLiteral(
                            `@qnpm/yis/components/${compNameInLowerCase}/${compNameInLowerCase}.css`
                        ))
                    ]);
                }
            }
        }
    }

    return ret;
}