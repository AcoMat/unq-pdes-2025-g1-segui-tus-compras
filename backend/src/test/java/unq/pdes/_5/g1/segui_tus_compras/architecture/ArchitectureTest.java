package unq.pdes._5.g1.segui_tus_compras.architecture;

import com.tngtech.archunit.base.DescribedPredicate;
import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

public class ArchitectureTest {

    private final JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("unq.pdes._5.g1.segui_tus_compras");
    @Test
    public void Services_should_only_be_accessed_by_Controllers() {
        ArchRule myRule = classes()
                .that().resideInAPackage("..service..")
                .should().onlyBeAccessed().byAnyPackage("..controller..", "..service..");

        myRule.check(importedClasses);
    }

    @Test
    public void MeLiApiService_should_only_be_accessed_by_ProductServices() {
        DescribedPredicate<? super JavaClass> allowedClasses =
                new DescribedPredicate<>("ProductService, ProductInternalService, or MeLiApiService") {
                    @Override
                    public boolean test(com.tngtech.archunit.core.domain.JavaClass input) {
                        String name = input.getSimpleName();
                        return name.equals("ProductService") ||
                                name.equals("ProductInternalService") ||
                                name.equals("MeLiApiService") ||
                                name.equals("SearchService");
                    }
                };

        ArchRule rule = classes()
                .that().haveSimpleName("MeLiApiService")
                .should().onlyBeAccessed()
                .byClassesThat(allowedClasses);

        rule.check(importedClasses);
    }
}
