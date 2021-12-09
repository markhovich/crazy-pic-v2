package com.jmdev.crazypic;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.jmdev.crazypic");

        noClasses()
            .that()
            .resideInAnyPackage("com.jmdev.crazypic.service..")
            .or()
            .resideInAnyPackage("com.jmdev.crazypic.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.jmdev.crazypic.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
